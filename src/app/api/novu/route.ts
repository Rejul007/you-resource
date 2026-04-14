import { serve } from '@novu/framework/next';
import { newResourceWorkflow } from '@/lib/novu/workflows';

export const { GET, POST, OPTIONS } = serve({
  workflows: [newResourceWorkflow],
});
