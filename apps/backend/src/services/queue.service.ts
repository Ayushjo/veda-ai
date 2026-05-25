import { Queue } from 'bullmq';
import { Redis as IORedis } from 'ioredis';
import { config } from '../config.js';

// Dedicated connection for BullMQ Queue — never share with cache
const queueConnection = new IORedis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const generationQueue = new Queue('generation-queue', {
  connection: queueConnection,
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
