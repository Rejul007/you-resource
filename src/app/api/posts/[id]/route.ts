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

    const { data: resources } = await adminSupabase
      .from('resources')
      .select('*')
      .eq('post_id', id)
      .order('votes', { ascending: false });

    return NextResponse.json({ ...post, resources: resources || [] });
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
