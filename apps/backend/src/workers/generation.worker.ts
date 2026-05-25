import { Worker, Job } from 'bullmq';
import { Redis as IORedis } from 'ioredis';
import { setCache } from '../services/cache.service.js';
import { config } from '../config.js';
import { Assignment } from '../models/Assignment.model.js';
import { Paper } from '../models/Paper.model.js';
import { generateQuestionPaper } from '../services/ai.service.js';
import { getIO } from '../socket/socket.js';

// Dedicated connection for BullMQ Worker — never share with cache
const workerConnection = new IORedis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const generationWorker = new Worker(
  'generation-queue',
  async (job: Job) => {
    const { assignmentId } = job.data as { assignmentId: string };

    // 1. Fetch assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment ${assignmentId} not found`);
    }

    // 2. Mark as processing
    assignment.status = 'processing';
    await assignment.save();

    // 3. Emit progress via socket
    try {
      getIO().to(assignmentId).emit('job:processing', { jobId: job.id, progress: 20 });
    } catch {
      // Socket may not be initialized in test/dev environments — non-fatal
      console.warn('Socket not available, skipping progress emit');
    }

    // 4. Generate paper via Claude
    console.log('[worker] fileText length:', assignment.fileText?.length ?? 0);
    const paperData = await generateQuestionPaper(assignment);

    // 5. Calculate totalMarks
    const totalMarks = assignment.questionTypes.reduce(
      (sum, qt) => sum + qt.count * qt.marksEach,
      0,
    );

    // 6. Persist Paper document
    const paper = new Paper({
      assignmentId: assignment._id,
      metadata: {
        subject: assignment.subject,
        gradeLevel: assignment.gradeLevel,
        totalMarks,
        duration: paperData.duration,
        dueDate: assignment.dueDate,
      },
      sections: paperData.sections,
      generatedAt: new Date(),
    });
    await paper.save();

    // 7. Cache paper in Redis (TTL = 1 hour)
    await setCache(`paper:${paper._id.toString()}`, paper.toObject(), 3600);

    // 8. Mark assignment as completed
    assignment.status = 'completed';
    assignment.paperId = paper._id as typeof assignment.paperId;
    await assignment.save();

    // 9. Emit completion via socket
    try {
      getIO()
        .to(assignmentId)
        .emit('job:completed', { jobId: job.id, paperId: paper._id.toString() });
    } catch {
      console.warn('Socket not available, skipping completion emit');
    }
  },
  { connection: workerConnection },
);

// Worker event handlers
generationWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} completed`);
});

generationWorker.on('failed', async (job: Job | undefined, err: Error) => {
  console.error(`Job ${job?.id} failed:`, err.message);

  const assignmentId: string | undefined = job?.data?.assignmentId;

  // Emit failure event via socket
  if (assignmentId) {
    try {
      getIO().to(assignmentId).emit('job:failed', { jobId: job?.id, error: err.message });
    } catch {
      // Socket may not be initialized — non-fatal
    }
  }

  // Update assignment status to 'failed'
  if (assignmentId) {
    try {
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
    } catch (updateErr) {
      console.error('Failed to update assignment status:', updateErr);
    }
  }
});

export default generationWorker;
