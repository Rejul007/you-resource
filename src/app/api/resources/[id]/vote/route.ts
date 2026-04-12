import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: resource } = await adminSupabase.from('resources').select('votes').eq('id', id).single();
    if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { data, error } = await adminSupabase
      .from('resources')
      .update({ votes: resource.votes + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ votes: data.votes });
  } catch (error) {
    console.error('POST /api/resources/[id]/vote error:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
