import { Router } from 'express';
import * as paperController from '../controllers/paper.controller.js';

const router = Router();

// GET /api/papers/assignment/:assignmentId  — must come BEFORE /:id
router.get('/assignment/:assignmentId', paperController.getPaperByAssignment);

// GET /api/papers/:id
router.get('/:id', paperController.getPaper);

export default router;
