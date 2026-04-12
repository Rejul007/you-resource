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
      <div className="relative text-center mb-12 py-10 hero-grid rounded-2xl overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(193,127,58,0.11) 0%, transparent 100%)',
        }} />
        <div className="relative">
          {/* Terminal badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6" style={{
            fontFamily: 'JetBrains Mono, monospace',
            background: 'rgba(193,127,58,0.08)',
            border: '1px solid rgba(193,127,58,0.22)',
            color: '#9A7A62',
            letterSpacing: '0.08em',
          }}>
            <span style={{ color: '#C17F3A' }}>✦</span> COMMUNITY STUDY PLATFORM
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A', lineHeight: 1.1 }}>
            Find Study Resources,{' '}
            <span style={{ background: 'linear-gradient(90deg, #C17F3A, #D4923F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Faster
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#9A7A62' }}>
            Search community-curated study resources, or request new ones. Our AI classifies requests so the right people can help.
          </p>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <HomeClient />

          {/* Recent Posts */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>Recent Requests</h2>
              <a href="/posts" className="text-sm font-medium transition-colors duration-150" style={{ color: '#9A7A62' }}>Browse all &rarr;</a>
            </div>
            {serializedPosts.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(193,127,58,0.1)' }}>
                  <svg className="w-8 h-8" style={{ color: '#C17F3A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>No posts yet</h3>
                <p className="mb-6" style={{ color: '#9A7A62' }}>Be the first to request study resources!</p>
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
