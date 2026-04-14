import { notFound } from 'next/navigation';
import { getSubjectColors } from '@/lib/subjectColors';
import { adminSupabase } from '@/lib/supabase/admin';
import RealtimePost from '@/components/RealtimePost';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  const { data: post, error } = await adminSupabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) notFound();

  const { data: resources } = await adminSupabase
    .from('resources')
    .select('*')
    .eq('post_id', id)
    .order('votes', { ascending: false });

  const colors = getSubjectColors(post.subject);
  let topics: string[] = [];
  try { topics = JSON.parse(post.topics); } catch { topics = []; }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const serializedResources = (resources || []).map((r) => ({
    id: r.id, url: r.url, description: r.description,
    language: r.language, price: r.price, type: r.type,
    submittedBy: r.submitted_by, votes: r.votes, createdAt: r.created_at,
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: '#5a3828' }}>
        <a href="/" className="transition-colors duration-150 hover:text-[#C8956A]" style={{ color: '#9A7A62' }}>Home</a>
        <span>/</span>
        <a href="/posts" className="transition-colors duration-150 hover:text-[#C8956A]" style={{ color: '#9A7A62' }}>Browse</a>
        <span>/</span>
        <span className="truncate max-w-xs" style={{ color: '#5a3828' }}>{post.title}</span>
      </nav>

      {/* Post Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.18)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold" style={colors.style}>
            {post.subject}
          </span>
          <span className="text-xs" style={{ color: '#5a3828' }}>
            {serializedResources.length} {serializedResources.length === 1 ? 'answer' : 'answers'}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>{post.title}</h1>
        <p className="leading-relaxed mb-5 text-sm" style={{ color: '#9A7A62' }}>{post.description}</p>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {topics.map((topic) => (
              <span key={topic} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(193,127,58,0.1)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.22)' }}>
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs pt-4" style={{ borderTop: '1px solid rgba(180,90,40,0.12)', color: '#5a3828' }}>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Requested by {post.author_name}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Answers */}
      <RealtimePost postId={post.id} initialResources={serializedResources} />
    </div>
  );
}
