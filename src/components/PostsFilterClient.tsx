'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import { getSubjectColors } from '@/lib/subjectColors';

interface Post {
  id: string;
  title: string;
  description: string;
  subject: string;
  topics: string;
  authorName: string;
  createdAt: string;
  _count: { resources: number };
}

interface PostsFilterClientProps {
  posts: Post[];
  subjects: string[];
}

export default function PostsFilterClient({ posts, subjects }: PostsFilterClientProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filtered = selectedSubject
    ? posts.filter((p) => p.subject === selectedSubject)
    : posts;

  return (
    <div>
      {/* Subject filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedSubject(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selectedSubject === null
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
          }`}
        >
          All ({posts.length})
        </button>
        {subjects.map((subject) => {
          const colors = getSubjectColors(subject);
          const count = posts.filter((p) => p.subject === subject).length;
          return (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject === selectedSubject ? null : subject)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedSubject === subject
                  ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1`
                  : `bg-white text-gray-700 border-gray-300 hover:${colors.bg} hover:${colors.text}`
              }`}
            >
              {subject} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No posts found for this subject.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              subject={post.subject}
              topics={post.topics}
              authorName={post.authorName}
              createdAt={post.createdAt}
              resourceCount={post._count.resources}
            />
          ))}
        </div>
      )}
    </div>
  );
}
