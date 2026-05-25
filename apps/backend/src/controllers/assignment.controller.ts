import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment.model.js';
import { addGenerationJob } from '../services/queue.service.js';
import { getIO } from '../socket/socket.js';

// POST /api/assignments
export async function createAssignment(req: Request, res: Response): Promise<void> {
  try {
    const {
      title,
      subject,
      gradeLevel,
      dueDate,
      questionTypes,
      additionalInstructions,
      fileText = '',
    } = req.body as {
      title: string;
      subject: string;
      gradeLevel: string;
      dueDate: string;
      questionTypes: { type: 'mcq' | 'short' | 'long' | 'true-false'; count: number; marksEach: number }[];
      additionalInstructions: string;
      fileText: string;
    };

    const totalMarks = questionTypes.reduce(
      (sum: number, qt: { count: number; marksEach: number }) => sum + qt.count * qt.marksEach,
      0,
    );

    // Step 1: Always save to MongoDB — this must succeed
    console.log('[controller] fileText length:', (req.body.fileText || '').length);
    const assignment = await Assignment.create({
      title,
      subject,
      gradeLevel,
      dueDate: new Date(dueDate),
      questionTypes,
      totalMarks,
      additionalInstructions,
      fileText,
      status: 'pending',
    });

    // Step 2: Try to queue the generation job — non-fatal if Redis is unavailable
    let jobId: string | null = null;
    try {
      jobId = await addGenerationJob(assignment._id.toString());
      assignment.jobId = jobId;
      await assignment.save();

      try {
        getIO()
          .to(assignment._id.toString())
          .emit('job:queued', { jobId, assignmentId: assignment._id });
      } catch {
        // Socket may not yet have a subscriber — non-fatal
      }
    } catch (queueErr) {
      // Redis / BullMQ is down — assignment is saved, generation will need to be retried
      console.warn('Queue unavailable, assignment saved without job. Will retry on next request.', queueErr);
    }

    res.status(201).json({ assignmentId: assignment._id, jobId });
  } catch (err) {
    console.error('createAssignment error:', err);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
}

// GET /api/assignments/:id
export async function getAssignment(req: Request, res: Response): Promise<void> {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }
    res.status(200).json(assignment);
  } catch (err) {
    console.error('getAssignment error:', err);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
}

// GET /api/assignments/:id/status
export async function getAssignmentStatus(req: Request, res: Response): Promise<void> {
  try {
    const assignment = await Assignment.findById(req.params.id).select('_id status jobId paperId');
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }
    res.status(200).json({
      status: assignment.status,
      jobId: assignment.jobId,
      paperId: assignment.paperId,
    });
  } catch (err) {
    console.error('getAssignmentStatus error:', err);
    res.status(500).json({ error: 'Failed to fetch assignment status' });
  }
}

// POST /api/assignments/:id/regenerate
export async function regenerateAssignment(req: Request, res: Response): Promise<void> {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    if (assignment.status === 'processing') {
      res.status(409).json({ error: 'Generation already in progress' });
      return;
    }

    assignment.status = 'pending';
    assignment.jobId = null;
    await assignment.save();

    const jobId = await addGenerationJob(assignment._id.toString());
    assignment.jobId = jobId;
    await assignment.save();

    try {
      getIO()
        .to(assignment._id.toString())
        .emit('job:queued', { jobId, assignmentId: assignment._id });
    } catch {
      // Socket subscriber may not exist yet — non-fatal
    }

    res.status(200).json({ assignmentId: assignment._id, jobId });
  } catch (err) {
    console.error('regenerateAssignment error:', err);
    res.status(500).json({ error: 'Failed to regenerate assignment' });
  }
}
