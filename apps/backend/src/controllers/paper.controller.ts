import { Request, Response } from 'express';
import { Paper } from '../models/Paper.model.js';
import { getCache, setCache } from '../services/cache.service.js';

type CachedPaper = { _id: string; sections: unknown[]; metadata: unknown };

// GET /api/papers/:id
export async function getPaper(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // 1. Try cache first
    const cached = await getCache<CachedPaper>(`paper:${id}`);
    if (cached) {
      res.status(200).json({ paper: cached, fromCache: true });
      return;
    }

    // 2. Fetch from MongoDB
    const paper = await Paper.findById(id);
    if (!paper) {
      res.status(404).json({ error: 'Paper not found' });
      return;
    }

    // 3. Populate cache for next request
    await setCache(`paper:${paper._id.toString()}`, paper.toObject(), 3600);

    res.status(200).json({ paper, fromCache: false });
  } catch (err: unknown) {
    // Invalid ObjectId format → treat as not found
    if (err instanceof Error && err.name === 'CastError') {
      res.status(404).json({ error: 'Paper not found' });
      return;
    }
    console.error('getPaper error:', err);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
}

// GET /api/papers/assignment/:assignmentId
export async function getPaperByAssignment(req: Request, res: Response): Promise<void> {
  try {
    const { assignmentId } = req.params;

    const paper = await Paper.findOne({ assignmentId });
    if (!paper) {
      res.status(404).json({ error: 'Paper not found' });
      return;
    }

    // Try cache first
    const cached = await getCache<CachedPaper>(`paper:${paper._id.toString()}`);
    if (cached) {
      res.status(200).json({ paper: cached });
      return;
    }

    res.status(200).json({ paper });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'CastError') {
      res.status(404).json({ error: 'Paper not found' });
      return;
    }
    console.error('getPaperByAssignment error:', err);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
}
