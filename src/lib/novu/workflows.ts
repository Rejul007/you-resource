import { workflow } from '@novu/framework';

export const newResourceWorkflow = workflow(
  'new-resource',
  async ({ step, payload }) => {
    await step.email('send-email', async () => ({
      subject: `${payload.submitterName} shared a resource on your post`,
      body: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#4f46e5;margin-bottom:8px">New Resource Shared</h2>
          <p style="color:#374151">
            <strong>${payload.submitterName}</strong> shared a new resource:
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin:12px 0;color:#166534;font-weight:600">
            ${payload.resourceTitle}
          </div>
          <a href="${payload.postUrl}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
            View Resource
          </a>
        </div>
      `,
    }));

    await step.inApp('in-app-notification', async () => ({
      subject: `New resource: ${payload.resourceTitle}`,
      body: `Shared by ${payload.submitterName}`,
      redirect: { url: payload.postUrl },
    }));
  },
  {
    payloadSchema: {
      type: 'object',
      properties: {
        submitterName: { type: 'string' },
        resourceTitle: { type: 'string' },
        postUrl: { type: 'string' },
      },
      required: ['submitterName', 'resourceTitle', 'postUrl'],
      additionalProperties: false,
    } as const,
  }
);
