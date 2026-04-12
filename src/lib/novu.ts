import { Novu } from '@novu/node';

const novu = new Novu(process.env.NOVU_API_KEY!);

function isConfigured() {
  return process.env.NOVU_API_KEY && process.env.NOVU_API_KEY !== 'your_novu_api_key';
}

export async function triggerCommentNotification(
  postId: string,
  commenterName: string,
  commentContent: string
) {
  if (!isConfigured()) return;
  try {
    await novu.trigger('new-comment', {
      to: { subscriberId: `post-${postId}` },
      payload: {
        commenterName,
        commentContent: commentContent.slice(0, 100),
        postUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${postId}`,
      },
    });
  } catch (e) {
    console.error('Novu trigger error (new-comment):', e);
  }
}

export async function triggerResourceNotification(
  postId: string,
  submitterName: string,
  resourceTitle: string
) {
  if (!isConfigured()) return;
  try {
    await novu.trigger('new-resource', {
      to: { subscriberId: `post-${postId}` },
      payload: {
        submitterName,
        resourceTitle,
        postUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${postId}`,
      },
    });
  } catch (e) {
    console.error('Novu trigger error (new-resource):', e);
  }
}
