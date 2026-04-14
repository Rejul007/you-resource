import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    const submittedBy = user?.username || user?.firstName || 'Anonymous';

    const { id } = await params;
    const { url, language, price, type, description } = await request.json();
    if (!url || !language || !price) {
      return NextResponse.json({ error: 'URL, language, and price are required' }, { status: 400 });
    }

    const { data: resource, error } = await adminSupabase
      .from('resources')
      .insert({
        post_id: id,
        url,
        title: url,
        description: description || '',
        language,
        price,
        type: type || 'Link',
        submitted_by: submittedBy,
        submitted_by_id: userId,
        votes: 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts/[id]/resources error:', error);
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
  }
}
