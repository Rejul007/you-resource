import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';
import { triggerCommentNotification } from '@/lib/novu';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { content, authorName, authorId, parentId } = await request.json();
    if (!content || !authorName) {
      return NextResponse.json({ error: 'Content and author name are required' }, { status: 400 });
    }

    const { data: comment, error } = await adminSupabase
      .from('comments')
      .insert({ post_id: id, content, author_name: authorName, author_id: authorId || null, parent_id: parentId || null, votes: 0 })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // trigger novu notification (fire and forget)
    triggerCommentNotification(id, authorName, content).catch(console.error);

    return NextResponse.json({ ...comment, replies: [] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts/[id]/comments error:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
