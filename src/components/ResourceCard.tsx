'use client';

import { useState } from 'react';

interface Resource {
  id: string; url: string; title: string; description: string;
  language: string; price: string; type: string; submittedBy: string;
  votes: number; createdAt: string;
}

const priceStyle: Record<string, React.CSSProperties> = {
  Free:     { background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' },
  Paid:     { background: 'rgba(239,68,68,0.1)',   color: '#fca5a5', border: '1px solid rgba(239,68,68,0.22)' },
  Freemium: { background: 'rgba(245,158,11,0.1)',  color: '#fcd34d', border: '1px solid rgba(245,158,11,0.22)' },
};

const typeIcons: Record<string, string> = {
  Video: '▶', Article: '◈', Book: '◻', Course: '◆', PDF: '▣', Other: '⬡',
};

export default function ResourceCard({ resource }: { resource: Resource }) {
  const [votes, setVotes] = useState(resource.votes);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleVote = async () => {
    if (voted || voting) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/resources/${resource.id}/vote`, { method: 'POST' });
      if (res.ok) { const data = await res.json(); setVotes(data.votes); setVoted(true); }
    } finally { setVoting(false); }
  };

  const domain = (() => {
    try { return new URL(resource.url).hostname.replace('www.', ''); } catch { return resource.url; }
  })();

  return (
    <div
      className="p-5 rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(180,90,40,0.18)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(193,127,58,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)')}
    >
      <div className="flex gap-4">
        {/* Vote */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleVote}
            disabled={voted || voting}
            className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl transition-all duration-150"
            style={voted
              ? { background: 'rgba(193,127,58,0.15)', color: '#D4923F', border: '1px solid rgba(193,127,58,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: '#5a3828', border: '1px solid rgba(180,90,40,0.15)' }
            }
          >
            <svg className="w-3.5 h-3.5" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-xs font-bold" style={{ color: voted ? '#D4923F' : '#9A7A62' }}>{votes}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-colors duration-150 flex items-center gap-1.5 group"
              style={{ color: '#C8956A', fontFamily: 'Syne, sans-serif' }}
            >
              <span style={{ color: '#C17F3A', fontSize: '0.75rem' }}>{typeIcons[resource.type] || '⬡'}</span>
              {resource.title}
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="text-xs mt-0.5" style={{ color: '#5a3828' }}>{domain}</p>
          </div>

          <p className="text-xs mb-3 leading-relaxed" style={{ color: '#9A7A62' }}>{resource.description}</p>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium" style={priceStyle[resource.price] || priceStyle.Freemium}>
              {resource.price}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#9A7A62', border: '1px solid rgba(180,90,40,0.15)' }}>
              {resource.type}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(14,165,233,0.1)', color: '#7dd3fc', border: '1px solid rgba(14,165,233,0.2)' }}>
              {resource.language}
            </span>
            <span className="text-xs ml-auto" style={{ color: '#5a3828' }}>by {resource.submittedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
