'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  url: string;
  title: string;
  description: string;
  language: string;
  price: string;
  type: string;
  submittedBy: string;
  votes: number;
  createdAt: string;
}

const priceColors: Record<string, string> = {
  Free: 'bg-green-100 text-green-800',
  Paid: 'bg-red-100 text-red-800',
  Freemium: 'bg-yellow-100 text-yellow-800',
};

const typeIcons: Record<string, string> = {
  Video: '▶',
  Article: '📄',
  Book: '📚',
  Course: '🎓',
  PDF: '📋',
  Other: '🔗',
};

export default function ResourceCard({ resource }: { resource: Resource }) {
  const [votes, setVotes] = useState(resource.votes);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleVote = async () => {
    if (voted || voting) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/resources/${resource.id}/vote`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
        setVoted(true);
      }
    } finally {
      setVoting(false);
    }
  };

  const domain = (() => {
    try {
      return new URL(resource.url).hostname.replace('www.', '');
    } catch {
      return resource.url;
    }
  })();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Vote button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleVote}
            disabled={voted || voting}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              voted
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 cursor-default'
                : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <svg className="w-4 h-4" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm font-bold">{votes}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5 group"
              >
                {typeIcons[resource.type] || '🔗'} {resource.title}
                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="text-xs text-gray-400 mt-0.5">{domain}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{resource.description}</p>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priceColors[resource.price] || 'bg-gray-100 text-gray-700'}`}>
              {resource.price}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {resource.type}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
              {resource.language}
            </span>
            <span className="text-xs text-gray-400 ml-auto">
              by {resource.submittedBy}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
