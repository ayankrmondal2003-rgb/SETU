import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  verifyPayment,
  createPremiumSubscription,
  verifyPremiumSubscription
} from '../controllers/paymentController.js';

const router = Router();

router.post('/verify', verifyPayment);

router.post('/premium/subscribe', requireAuth, createPremiumSubscription);
router.post('/premium/verify', requireAuth, verifyPremiumSubscription);

export default router;
