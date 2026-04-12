import { createClient } from '@/lib/supabase/server';
import PostCard from '@/components/PostCard';
import PostsFilterClient from '@/components/PostsFilterClient';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: rawPosts } = await supabase
    .from('posts')
    .select('*, resources(count)')
    .order('created_at', { ascending: false });

  const posts = (rawPosts || []).map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    subject: post.subject,
    topics: post.topics,
    authorName: post.author_name,
    createdAt: post.created_at,
    _count: { resources: post.resources?.[0]?.count ?? 0 },
  }));

  const subjects = Array.from(new Set(posts.map((p) => p.subject))).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Resources</h1>
          <p className="text-gray-500 mt-1">
            {posts.length} resource request{posts.length !== 1 ? 's' : ''} from the community
          </p>
        </div>
        <a href="/request" className="btn-primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request Resources
        </a>
      </div>

      <PostsFilterClient posts={posts} subjects={subjects} />
    </div>
  );
}
