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

interface Props {
  postId: string;
  initialResources: Resource[];
  initialComments: Comment[];
}

export default function RealtimePost({ postId, initialResources, initialComments }: Props) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`post-${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'resources', filter: `post_id=eq.${postId}` },
        (payload) => {
          const r = payload.new as Record<string, unknown>;
          setResources(prev => {
            // avoid duplicates
            if (prev.some(x => x.id === r.id)) return prev;
            return [...prev, {
              id: r.id as string,
              url: r.url as string,
              title: r.title as string,
              description: r.description as string,
              language: r.language as string,
              price: r.price as string,
              type: r.type as string,
              submittedBy: r.submitted_by as string,
              votes: r.votes as number,
              createdAt: r.created_at as string,
            }];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          const c = payload.new as Record<string, unknown>;
          if (!c.parent_id) {
            setComments(prev => {
              if (prev.some(x => x.id === c.id)) return prev;
              return [...prev, {
                id: c.id as string,
                content: c.content as string,
                authorName: c.author_name as string,
                votes: c.votes as number,
                createdAt: c.created_at as string,
                parentId: null,
                postId: c.post_id as string,
                replies: [],
              }];
            });
          } else {
            setComments(prev => prev.map(comment => {
              if (comment.id === c.parent_id) {
                if (comment.replies.some(r => r.id === c.id)) return comment;
                return {
                  ...comment,
                  replies: [...comment.replies, {
                    id: c.id as string,
                    content: c.content as string,
                    authorName: c.author_name as string,
                    votes: c.votes as number,
                    createdAt: c.created_at as string,
                    parentId: c.parent_id as string,
                    postId: c.post_id as string,
                    replies: [],
                  }],
                };
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resources ({resources.length})</h2>
        {resources.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 mb-4">
            <p className="mb-2 font-medium">No resources yet</p>
            <p className="text-sm">Be the first to share a resource for this request!</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {[...resources].sort((a, b) => b.votes - a.votes).map((resource) => (
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
