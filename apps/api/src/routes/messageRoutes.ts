import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  initiateOrGetConversation,
  getTouristConversations,
  getConversationThread,
  sendMessageInConversation
} from '../controllers/messageController.js';

const router = Router();

router.use(requireAuth);

router.post('/', initiateOrGetConversation);
router.get('/me', getTouristConversations);
router.get('/:id/messages', getConversationThread);
router.post('/:id/messages', sendMessageInConversation);

export default router;
