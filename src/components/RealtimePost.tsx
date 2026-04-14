'use client';

import { useState, useCallback } from 'react';
import AnswerCard from './AnswerCard';
import AddAnswerForm from './AddAnswerForm';

interface Resource {
  id: string; url: string; description: string;
  language: string; price: string; type: string; submittedBy: string;
  votes: number; createdAt: string;
}

export default function RealtimePost({ postId, initialResources }: {
  postId: string; initialResources: Resource[];
}) {
  const [resources, setResources] = useState<Resource[]>(initialResources);

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) {
        const post = await res.json();
        setResources((post.resources || []).map((r: Record<string, unknown>) => ({
          id: r.id as string, url: r.url as string, description: r.description as string,
          language: r.language as string, price: r.price as string, type: r.type as string,
          submittedBy: r.submitted_by as string, votes: r.votes as number, createdAt: r.created_at as string,
        })));
      }
    } catch { /* ignore */ }
  }, [postId]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
          Answers <span style={{ color: '#5a3828', fontSize: '0.875rem', fontWeight: 400 }}>({resources.length})</span>
        </h2>

        {resources.length === 0 ? (
          <div className="rounded-2xl p-8 text-center mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(180,90,40,0.25)' }}>
            <p className="font-medium text-sm mb-1" style={{ color: '#9A7A62' }}>No answers yet</p>
            <p className="text-xs" style={{ color: '#5a3828' }}>Be the first to share a resource for this request!</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {[...resources].sort((a, b) => b.votes - a.votes).map(resource => (
              <AnswerCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        <AddAnswerForm postId={postId} onResourceAdded={fetchResources} />
      </div>
    </>
  );
}
