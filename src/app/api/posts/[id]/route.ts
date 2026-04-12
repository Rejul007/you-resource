import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: post, error } = await adminSupabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const [{ data: resources }, { data: comments }] = await Promise.all([
      adminSupabase.from('resources').select('*').eq('post_id', id).order('votes', { ascending: false }),
      adminSupabase.from('comments').select('*').eq('post_id', id).is('parent_id', null).order('created_at', { ascending: true }),
    ]);

    // fetch replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: replies } = await adminSupabase
          .from('comments')
          .select('*')
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true });
        const repliesWithNested = await Promise.all(
          (replies || []).map(async (reply) => {
            const { data: nested } = await adminSupabase
              .from('comments')
              .select('*')
              .eq('parent_id', reply.id)
              .order('created_at', { ascending: true });
            return { ...reply, replies: nested || [] };
          })
        );
        return { ...comment, replies: repliesWithNested };
      })
    );

    return NextResponse.json({ ...post, resources: resources || [], comments: commentsWithReplies });
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
