import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import HomeClient from '@/components/HomeClient';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*, resources(count)')
    .order('created_at', { ascending: false })
    .limit(8);

  const serializedPosts = (recentPosts || []).map((post) => ({
    ...post,
    createdAt: post.created_at,
    authorName: post.author_name,
    resourceCount: post.resources?.[0]?.count ?? 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Find Study Resources, <span className="text-indigo-600">Faster</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Search community-curated study resources, or request new ones. Our AI classifies requests so the right people can help.
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <HomeClient />

          {/* Recent Posts */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
              <a href="/posts" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Browse all &rarr;</a>
            </div>
            {serializedPosts.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-6">Be the first to request study resources!</p>
                <a href="/request" className="btn-primary">Request Resources</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serializedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    subject={post.subject}
                    topics={post.topics}
                    authorName={post.author_name}
                    createdAt={post.created_at}
                    resourceCount={post.resourceCount}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
