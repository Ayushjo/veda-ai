import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// pdf-parse is a CommonJS module with no ESM default export
const pdf = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
import { validateBody } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import * as assignmentController from '../controllers/assignment.controller.js';

const router = Router();

function uploadMiddleware(req: Request, res: Response, next: NextFunction) {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

// ─── Zod schema ──────────────────────────────────────────────────────────────

const CreateAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  dueDate: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Due date must be in the future',
  }),
  questionTypes: z
    .array(
      z.object({
        type: z.enum(['mcq', 'short', 'long', 'true-false']),
        count: z.number().int().min(1).max(50),
        marksEach: z.number().int().min(1).max(20),
      }),
    )
    .min(1, 'At least one question type required'),
  additionalInstructions: z.string().optional().default(''),
  fileText: z.string().optional().default(''),
});

// ─── PDF / text parse middleware ─────────────────────────────────────────────

async function parsePdfMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdf(req.file.buffer);
        req.body.fileText = data.text;
      } else if (req.file.mimetype === 'text/plain') {
        req.body.fileText = req.file.buffer.toString('utf-8');
      }
    }
  } catch {
    // If parsing fails, continue without fileText — non-fatal
  }
  console.log('[upload] fileText length:', req.body.fileText?.length ?? 0);
  next();
}

// ─── questionTypes JSON parse middleware ──────────────────────────────────────

function parseQuestionTypes(req: Request, _res: Response, next: NextFunction): void {
  if (typeof req.body.questionTypes === 'string') {
    try {
      req.body.questionTypes = JSON.parse(req.body.questionTypes);
    } catch {
      req.body.questionTypes = [];
    }
  }
  next();
}

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post(
  '/',
  uploadMiddleware,
  parsePdfMiddleware,
  parseQuestionTypes,
  validateBody(CreateAssignmentSchema),
  assignmentController.createAssignment,
);

router.get('/:id', assignmentController.getAssignment);
router.get('/:id/status', assignmentController.getAssignmentStatus);
router.post('/:id/regenerate', assignmentController.regenerateAssignment);

export default router;
