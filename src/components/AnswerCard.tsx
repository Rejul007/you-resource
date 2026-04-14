'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface AnswerProps {
  resource: {
    id: string;
    url: string;
    description: string;
    language: string;
    price: string;
    type: string;
    submittedBy: string;
    votes: number;
    createdAt: string;
  };
}

const priceBadge = (price: string) => {
  if (price.toLowerCase() === 'free') return { bg: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: 'rgba(16,185,129,0.25)' };
  return { bg: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: 'rgba(239,68,68,0.25)' };
};

export default function AnswerCard({ resource }: AnswerProps) {
  const { isSignedIn } = useUser();
  const [votes, setVotes] = useState(resource.votes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [voting, setVoting] = useState(false);

  const handleVote = async (direction: 'up' | 'down') => {
    if (voting || !isSignedIn) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/resources/${resource.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
        setUserVote(data.userVote);
      }
    } finally {
      setVoting(false);
    }
  };

  const priceStyle = priceBadge(resource.price);

  return (
    <div
      className="flex gap-3 rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(180,90,40,0.15)' }}
    >
      {/* Vote column */}
      <div className="flex flex-col items-center gap-0.5 shrink-0 pt-1">
        <button
          onClick={() => handleVote('up')}
          disabled={voting || !isSignedIn}
          className="p-1 rounded-lg transition-colors duration-150 disabled:opacity-30"
          style={{ color: userVote === 'up' ? '#10b981' : '#5a3828' }}
          onMouseEnter={e => { if (isSignedIn) e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { if (userVote !== 'up') e.currentTarget.style.color = '#5a3828'; }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l8 8H4l8-8z" /></svg>
        </button>
        <span
          className="text-sm font-bold tabular-nums w-6 text-center"
          style={{ color: votes > 0 ? '#10b981' : votes < 0 ? '#ef4444' : '#5a3828' }}
        >
          {votes}
        </span>
        <button
          onClick={() => handleVote('down')}
          disabled={voting || !isSignedIn}
          className="p-1 rounded-lg transition-colors duration-150 disabled:opacity-30"
          style={{ color: userVote === 'down' ? '#ef4444' : '#5a3828' }}
          onMouseEnter={e => { if (isSignedIn) e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { if (userVote !== 'down') e.currentTarget.style.color = '#5a3828'; }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l-8-8h16l-8 8z" /></svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Badges above link */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
            {resource.language}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: priceStyle.bg, color: priceStyle.color, border: `1px solid ${priceStyle.border}` }}>
            {resource.price}
          </span>
          {resource.type && resource.type !== 'Link' && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(193,127,58,0.1)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.2)' }}>
              {resource.type}
            </span>
          )}
        </div>

        {/* Link */}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium break-all transition-colors duration-150"
          style={{ color: '#818cf8' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
          onMouseLeave={e => (e.currentTarget.style.color = '#818cf8')}
        >
          {resource.url}
        </a>

        {/* Comment */}
        {resource.description && (
          <p className="text-xs mt-1.5" style={{ color: '#9A7A62' }}>{resource.description}</p>
        )}

        {/* Meta */}
        <p className="text-xs mt-2" style={{ color: '#5a3828' }}>
          by {resource.submittedBy} &middot; {new Date(resource.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
