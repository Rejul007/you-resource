import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    let query = adminSupabase
      .from('posts')
      .select('*, resources(count), comments(count)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.textSearch('search_vector', search, { type: 'websearch' });
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
    const { title, description, subject, topics, authorName, authorId } = await request.json();
    if (!title || !description || !subject || !topics || !authorName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const topicsString = Array.isArray(topics) ? JSON.stringify(topics) : topics;
    const { data, error } = await adminSupabase
      .from('posts')
      .insert({ title, description, subject, topics: topicsString, author_name: authorName, author_id: authorId || null })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
