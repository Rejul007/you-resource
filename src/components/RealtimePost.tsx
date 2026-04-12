'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ResourceCard from './ResourceCard';
import AddResourceForm from './AddResourceForm';
import DiscussionSection from './DiscussionSection';

interface Resource {
  id: string; url: string; title: string; description: string;
  language: string; price: string; type: string; submittedBy: string;
  votes: number; createdAt: string;
}

interface Comment {
  id: string; content: string; authorName: string; votes: number;
  createdAt: string; parentId: string | null; postId: string; replies: Comment[];
}

export default function RealtimePost({ postId, initialResources, initialComments }: {
  postId: string; initialResources: Resource[]; initialComments: Comment[];
}) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`post-${postId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'resources', filter: `post_id=eq.${postId}` },
        (payload) => {
          const r = payload.new as Record<string, unknown>;
          setResources(prev => {
            if (prev.some(x => x.id === r.id)) return prev;
            return [...prev, { id: r.id as string, url: r.url as string, title: r.title as string, description: r.description as string, language: r.language as string, price: r.price as string, type: r.type as string, submittedBy: r.submitted_by as string, votes: r.votes as number, createdAt: r.created_at as string }];
          });
        }
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          const c = payload.new as Record<string, unknown>;
          if (!c.parent_id) {
            setComments(prev => {
              if (prev.some(x => x.id === c.id)) return prev;
              return [...prev, { id: c.id as string, content: c.content as string, authorName: c.author_name as string, votes: c.votes as number, createdAt: c.created_at as string, parentId: null, postId: c.post_id as string, replies: [] }];
            });
          } else {
            setComments(prev => prev.map(comment => {
              if (comment.id === c.parent_id) {
                if (comment.replies.some(r => r.id === c.id)) return comment;
                return { ...comment, replies: [...comment.replies, { id: c.id as string, content: c.content as string, authorName: c.author_name as string, votes: c.votes as number, createdAt: c.created_at as string, parentId: c.parent_id as string, postId: c.post_id as string, replies: [] }] };
              }
              return comment;
            }));
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
          Resources <span style={{ color: '#5a3828', fontSize: '0.875rem', fontWeight: 400 }}>({resources.length})</span>
        </h2>

        {resources.length === 0 ? (
          <div className="rounded-2xl p-8 text-center mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(180,90,40,0.25)' }}>
            <p className="font-medium text-sm mb-1" style={{ color: '#9A7A62' }}>No resources yet</p>
            <p className="text-xs" style={{ color: '#5a3828' }}>Be the first to share a resource for this request!</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {[...resources].sort((a, b) => b.votes - a.votes).map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        <AddResourceForm postId={postId} />
      </div>

      <DiscussionSection postId={postId} comments={comments} />
    </>
  );
}
