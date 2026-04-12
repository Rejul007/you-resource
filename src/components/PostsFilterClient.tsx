'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import { getSubjectColors } from '@/lib/subjectColors';

interface Post {
  id: string; title: string; description: string; subject: string;
  topics: string; authorName: string; createdAt: string;
  _count: { resources: number };
}

export default function PostsFilterClient({ posts, subjects }: { posts: Post[]; subjects: string[] }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const filtered = selectedSubject ? posts.filter((p) => p.subject === selectedSubject) : posts;

  return (
    <div>
      {/* Subject filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedSubject(null)}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150"
          style={selectedSubject === null
            ? { background: 'linear-gradient(135deg, #D4923F, #C17F3A)', color: '#fff', border: '1px solid transparent', boxShadow: '0 2px 12px rgba(193,127,58,0.35)' }
            : { background: 'rgba(255,255,255,0.04)', color: '#9A7A62', border: '1px solid rgba(180,90,40,0.2)' }
          }
        >
          All ({posts.length})
        </button>
        {subjects.map((subject) => {
          const colors = getSubjectColors(subject);
          const count = posts.filter((p) => p.subject === subject).length;
          const isActive = selectedSubject === subject;
          return (
            <button
              key={subject}
              onClick={() => setSelectedSubject(isActive ? null : subject)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150"
              style={isActive
                ? { ...colors.style, boxShadow: `0 0 0 2px ${colors.style.color}40` }
                : { background: 'rgba(255,255,255,0.03)', color: '#9A7A62', border: '1px solid rgba(180,90,40,0.18)' }
              }
            >
              {subject} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: '#5a3828' }}>
          <p className="text-lg">No posts found for this subject.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <PostCard key={post.id} {...post} resourceCount={post._count.resources} />
          ))}
        </div>
      )}
    </div>
  );
}
