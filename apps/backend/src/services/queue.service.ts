import { Queue } from 'bullmq';
import redisClient from './cache.service.js';

const generationQueue = new Queue('generation-queue', {
  connection: redisClient,
});

generationQueue.on('error', (err: Error) => {
  console.error('Queue error:', err.message);
});

export async function addGenerationJob(assignmentId: string): Promise<string> {
  const job = await generationQueue.add(
    'generate',
    { assignmentId },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    },
  );
  return job.id as string;
}

export { generationQueue };
