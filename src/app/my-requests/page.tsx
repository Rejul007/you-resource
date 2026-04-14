import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { adminSupabase } from '@/lib/supabase/admin';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function MyRequestsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { data: rawPosts } = await adminSupabase
    .from('posts')
    .select('*, resources(count)')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  const posts = (rawPosts || []).map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    subject: post.subject,
    topics: post.topics,
    authorName: post.author_name,
    createdAt: post.created_at,
    resourceCount: post.resources?.[0]?.count ?? 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
            My Requests
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#5a3828' }}>
            {posts.length} request{posts.length !== 1 ? 's' : ''} you&apos;ve posted
          </p>
        </div>
        <a href="/request" className="btn-primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(193,127,58,0.1)' }}>
            <svg className="w-8 h-8" style={{ color: '#C17F3A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>No requests yet</h3>
          <p className="mb-6" style={{ color: '#9A7A62' }}>You haven&apos;t posted any resource requests yet.</p>
          <a href="/request" className="btn-primary">Request Resources</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              subject={post.subject}
              topics={post.topics}
              authorName={post.authorName}
              createdAt={post.createdAt}
              resourceCount={post.resourceCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
