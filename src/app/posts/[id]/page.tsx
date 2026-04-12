import { notFound } from 'next/navigation';
import { getSubjectColors } from '@/lib/subjectColors';
import Sidebar from '@/components/Sidebar';
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
    id: r.id,
    url: r.url,
    title: r.title,
    description: r.description,
    language: r.language,
    price: r.price,
    type: r.type,
    submittedBy: r.submitted_by,
    votes: r.votes,
    createdAt: r.created_at,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedComments = (post.comments || []).map((c: any) => normalizeComment(c));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-gray-700">Home</a>
            <span>/</span>
            <a href="/posts" className="hover:text-gray-700">Browse</a>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{post.title}</span>
          </nav>

          {/* Post Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                {post.subject}
              </span>
              <span className="text-sm text-gray-500">
                {serializedResources.length} {serializedResources.length === 1 ? 'resource' : 'resources'}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
            <p className="text-gray-600 leading-relaxed mb-5">{post.description}</p>

            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-sm text-gray-500 mr-1">Topics:</span>
                {topics.map((topic) => (
                  <span key={topic} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {topic}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400 pt-4 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Requested by {post.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Realtime Resources + Comments */}
          <RealtimePost postId={post.id} initialResources={serializedResources} initialComments={serializedComments} />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
