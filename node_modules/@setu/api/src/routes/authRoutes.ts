import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { googleConfig, googleLogin } from '../controllers/googleAuthController.js';
import rateLimit from 'express-rate-limit';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.use('/google', rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }));
router.get('/google/config', googleConfig);
router.post('/google', googleLogin);

export default router;
