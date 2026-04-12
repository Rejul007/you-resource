'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CommentData {
  id: string; content: string; authorName: string; votes: number;
  createdAt: string; parentId: string | null; postId: string; replies: CommentData[];
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const replyInputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8125rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(180,90,40,0.18)',
  color: '#E8D5C0', outline: 'none', resize: 'none' as const,
};

function CommentItem({ comment, postId, depth = 0 }: { comment: CommentData; postId: string; depth?: number }) {
  const router = useRouter();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState(comment.votes);
  const [voting, setVoting] = useState(false);

  const handleVote = async (direction: 'up' | 'down') => {
    if (voting) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}/vote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      const data = await res.json();
      setVotes(data.votes);
    } finally { setVoting(false); }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyName.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, authorName: replyName, parentId: comment.id }),
      });
      setReplyContent(''); setReplyName(''); setShowReplyForm(false);
      router.refresh();
    } finally { setLoading(false); }
  };

  return (
    <div
      className={depth > 0 ? 'ml-6 pl-4' : ''}
      style={depth > 0 ? { borderLeft: '2px solid rgba(180,90,40,0.15)' } : {}}
    >
      <div className="py-3">
        {/* Author row */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0"
            style={{ background: 'rgba(193,127,58,0.15)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.25)' }}
          >
            {comment.authorName.charAt(0)}
          </div>
          <span className="text-xs font-semibold" style={{ color: '#C8956A' }}>{comment.authorName}</span>
          <span className="text-xs" style={{ color: '#5a3828' }}>{timeAgo(comment.createdAt)}</span>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed ml-8" style={{ color: '#9A7A62' }}>{comment.content}</p>

        {/* Vote + Reply row */}
        <div className="ml-8 mt-2 flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handleVote('up')}
              disabled={voting}
              className="p-1 rounded-lg transition-colors duration-150 disabled:opacity-40"
              style={{ color: '#5a3828' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#10b981')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5a3828')}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l8 8H4l8-8z" /></svg>
            </button>
            <span
              className="text-xs font-semibold w-5 text-center tabular-nums"
              style={{ color: votes > 0 ? '#10b981' : votes < 0 ? '#ef4444' : '#5a3828' }}
            >
              {votes}
            </span>
            <button
              onClick={() => handleVote('down')}
              disabled={voting}
              className="p-1 rounded-lg transition-colors duration-150 disabled:opacity-40"
              style={{ color: '#5a3828' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5a3828')}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l-8-8h16l-8 8z" /></svg>
            </button>
          </div>

          {depth < 2 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-medium transition-colors duration-150"
              style={{ color: '#5a3828' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C8956A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5a3828')}
            >
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>

        {showReplyForm && (
          <form onSubmit={handleReply} className="ml-8 mt-3 space-y-2">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              style={replyInputStyle}
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={replyName}
                onChange={e => setReplyName(e.target.value)}
                placeholder="Your name"
                style={{ ...replyInputStyle, flex: 1 }}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 disabled:opacity-50 text-white"
                style={{ background: 'linear-gradient(135deg, #D4923F, #C17F3A)' }}
              >
                {loading ? '...' : 'Reply'}
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies?.map(reply => (
        <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function DiscussionSection({ postId, comments }: { postId: string; comments: CommentData[] }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorName }),
      });
      if (!res.ok) throw new Error('Failed');
      setContent(''); setAuthorName('');
      router.refresh();
    } catch { setError('Failed to post comment. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '0.875rem',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(180,90,40,0.18)',
    color: '#E8D5C0', outline: 'none',
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(180,90,40,0.15)' }}>
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
        <svg className="w-4 h-4" style={{ color: '#C17F3A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Discussion <span style={{ color: '#5a3828', fontSize: '0.875rem', fontWeight: 400 }}>({comments.length})</span>
      </h2>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.12)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5a3828' }}>Add a comment</p>
        {error && <p className="text-xs p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>{error}</p>}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share your thoughts, ask a question, or add context..."
          rows={3}
          required
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(193,127,58,0.5)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)'; }}
        />
        <div className="flex gap-3">
          <input
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="Your display name"
            required
            style={{ ...inputStyle, flex: 1 }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(193,127,58,0.5)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)'; }}
          />
          <button type="submit" disabled={loading} className="btn-primary text-sm px-4">
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-10 h-10 mx-auto mb-3" style={{ color: '#5a3828' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm" style={{ color: '#5a3828' }}>No comments yet. Start the discussion!</p>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid rgba(180,90,40,0.1)' }}>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} postId={postId} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
