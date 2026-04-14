import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { direction } = await request.json() as { direction: 'up' | 'down' };
    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({ error: 'Invalid direction' }, { status: 400 });
    }

    const delta = direction === 'up' ? 1 : -1;

    // Check for existing vote
    const { data: existingVote } = await adminSupabase
      .from('resource_votes')
      .select('*')
      .eq('resource_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    let scoreDelta = 0;

    if (!existingVote) {
      // New vote
      await adminSupabase.from('resource_votes').insert({ resource_id: id, user_id: userId, direction });
      scoreDelta = delta;
    } else if (existingVote.direction === direction) {
      // Toggle off (remove vote)
      await adminSupabase.from('resource_votes').delete().eq('id', existingVote.id);
      scoreDelta = -delta;
    } else {
      // Flip vote
      await adminSupabase.from('resource_votes').update({ direction }).eq('id', existingVote.id);
      scoreDelta = delta * 2;
    }

    // Update resource score
    const { data: resource } = await adminSupabase.from('resources').select('votes').eq('id', id).single();
    if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newScore = resource.votes + scoreDelta;
    await adminSupabase.from('resources').update({ votes: newScore }).eq('id', id);

    // Get current user's vote state
    const { data: userVote } = await adminSupabase
      .from('resource_votes')
      .select('direction')
      .eq('resource_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    return NextResponse.json({ votes: newScore, userVote: userVote?.direction || null });
  } catch (error) {
    console.error('POST /api/resources/[id]/vote error:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
