import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';
import { triggerResourceNotification } from '@/lib/novu';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { url, title, description, language, price, type, submittedBy, submittedById } = await request.json();
    if (!url || !title || !description || !language || !price || !type || !submittedBy) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const { data: resource, error } = await adminSupabase
      .from('resources')
      .insert({ post_id: id, url, title, description, language, price, type, submitted_by: submittedBy, submitted_by_id: submittedById || null, votes: 0 })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // trigger novu notification (fire and forget)
    triggerResourceNotification(id, submittedBy, title).catch(console.error);

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts/[id]/resources error:', error);
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
  }
}
