import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { direction } = await request.json();
    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({ error: 'Invalid direction' }, { status: 400 });
    }

    const { data: comment } = await adminSupabase.from('comments').select('votes').eq('id', id).single();
    if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { data, error } = await adminSupabase
      .from('comments')
      .update({ votes: comment.votes + (direction === 'up' ? 1 : -1) })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ votes: data.votes });
  } catch (error) {
    console.error('POST /api/comments/[id]/vote error:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
