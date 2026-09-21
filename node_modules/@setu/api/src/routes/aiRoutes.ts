import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAiRecommendation } from '../controllers/aiController.js';

const router = Router();

router.post('/recommend', requireAuth, getAiRecommendation);

export default router;
