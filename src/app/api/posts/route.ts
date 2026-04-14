import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const authorId = searchParams.get('authorId');
  const topics = searchParams.get('topics');

  try {
    let query = adminSupabase
      .from('posts')
      .select('*, resources(count)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.textSearch('search_vector', search, { type: 'websearch' });
    }
    if (authorId) {
      query = query.eq('author_id', authorId);
    }
    if (topics) {
      // Search by topic keywords for similar-posts feature
      query = query.textSearch('search_vector', topics.split(',').join(' | '), { type: 'websearch' });
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    const authorName = user?.username || user?.firstName || 'Anonymous';

    const { title, description, subject, topics } = await request.json();
    if (!title || !description || !subject || !topics) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const topicsString = Array.isArray(topics) ? JSON.stringify(topics) : topics;
    const { data, error } = await adminSupabase
      .from('posts')
      .insert({ title, description, subject, topics: topicsString, author_name: authorName, author_id: userId })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
