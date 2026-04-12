import { notFound } from 'next/navigation';
import { getSubjectColors } from '@/lib/subjectColors';
import RealtimePost from '@/components/RealtimePost';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeComment(c: any): any {
  return {
    id: c.id,
    content: c.content,
    authorName: c.author_name,
    votes: c.votes,
    createdAt: c.created_at,
    parentId: c.parent_id ?? null,
    postId: c.post_id,
    replies: (c.replies || []).map((r: any) => normalizeComment(r)),
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const post = await res.json();

  const colors = getSubjectColors(post.subject);
  let topics: string[] = [];
  try { topics = JSON.parse(post.topics); } catch { topics = []; }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedResources = (post.resources || []).map((r: any) => ({
    id: r.id, url: r.url, title: r.title, description: r.description,
    language: r.language, price: r.price, type: r.type,
    submittedBy: r.submitted_by, votes: r.votes, createdAt: r.created_at,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedComments = (post.comments || []).map((c: any) => normalizeComment(c));

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
            {serializedResources.length} {serializedResources.length === 1 ? 'resource' : 'resources'}
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

      {/* Realtime Resources + Comments */}
      <RealtimePost postId={post.id} initialResources={serializedResources} initialComments={serializedComments} />
    </div>
  );
}
