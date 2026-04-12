'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import PostCard from './PostCard';

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

export default function HomeClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/posts?search=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setSearched(false);
  };

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: '#5a3828' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by subject, topic, or keyword..."
              className="w-full pl-11 pr-10 py-3 rounded-xl transition-all duration-200 focus:outline-none text-sm"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(180,90,40,0.2)',
                color: '#E8D5C0',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(193,127,58,0.55)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(193,127,58,0.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(180,90,40,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#5a3828' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary px-6" disabled={loading}>
            {loading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : 'Search'}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searched && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin w-8 h-8" style={{ color: '#C17F3A' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : results && results.length > 0 ? (
            <div>
              <p className="text-sm mb-4" style={{ color: '#5a3828' }}>
                Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((post) => (
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
            </div>
          ) : (
            <div className="card p-10 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(193,127,58,0.1)' }}>
                <svg className="w-7 h-7" style={{ color: '#C17F3A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>No resources found</h3>
              <p className="mb-6 text-sm" style={{ color: '#9A7A62' }}>
                No results for &ldquo;{query}&rdquo;. Be the first to request these resources!
              </p>
              <Link href="/request" className="btn-primary">
                Request Resources
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
