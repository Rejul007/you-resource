import { serve } from '@novu/framework/next';
import { newCommentWorkflow, newResourceWorkflow } from '@/lib/novu/workflows';

export const { GET, POST, OPTIONS } = serve({
  workflows: [newCommentWorkflow, newResourceWorkflow],
});
