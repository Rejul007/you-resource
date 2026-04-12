'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CommentData {
  id: string;
  content: string;
  authorName: string;
  votes: number;
  createdAt: string;
  parentId: string | null;
  postId: string;
  replies: CommentData[];
}

interface DiscussionSectionProps {
  postId: string;
  comments: CommentData[];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function CommentItem({
  comment,
  postId,
  depth = 0,
}: {
  comment: CommentData;
  postId: string;
  depth?: number;
}) {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      const data = await res.json();
      setVotes(data.votes);
    } finally {
      setVoting(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyName.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          authorName: replyName,
          parentId: comment.id,
        }),
      });
      setReplyContent('');
      setReplyName('');
      setShowReplyForm(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold uppercase">
            {comment.authorName.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-gray-900">{comment.authorName}</span>
          <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed ml-9">{comment.content}</p>

        <div className="ml-9 mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote('up')}
              disabled={voting}
              className="p-1 rounded hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
              title="Upvote"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l8 8H4l8-8z" />
              </svg>
            </button>
            <span className={`text-xs font-semibold w-5 text-center ${votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-500' : 'text-gray-400'}`}>
              {votes}
            </span>
            <button
              onClick={() => handleVote('down')}
              disabled={voting}
              className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Downvote"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 20l-8-8h16l-8 8z" />
              </svg>
            </button>
          </div>

          {depth < 2 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium"
            >
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>

        {showReplyForm && (
          <form onSubmit={handleReply} className="ml-9 mt-3 space-y-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscussionSection({ postId, comments }: DiscussionSectionProps) {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorName }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      setContent('');
      setAuthorName('');
      router.refresh();
    } catch {
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Discussion ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add a comment</h3>
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, ask a question, or add context..."
          rows={3}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none text-sm mb-3"
        />
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your display name"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-sm"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">No comments yet. Start the discussion!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
