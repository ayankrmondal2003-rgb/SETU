import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  getVendorProfile,
  updateVendorProfile,
  getVendorOfferings,
  createOffering,
  updateOffering,
  deleteOffering,
  getVendorOrders,
  updateOrderStatus,
  getVendorNotifications,
  markNotificationRead,
  getVendorConversations,
  getConversationMessages,
  sendConversationMessage,
  getOwnVendorStorefront,
  getVendorPublicStorefront
} from '../controllers/vendorController.js';

const router = Router();

// Public Storefront route
router.get('/public/storefront/:slug', getVendorPublicStorefront);

// Protect remaining vendor routes
router.use(requireAuth, requireRole('VENDOR'));

router.get('/me', getVendorProfile);
router.put('/me', updateVendorProfile);

router.get('/me/offerings', getVendorOfferings);
router.post('/me/offerings', createOffering);
router.put('/me/offerings/:id', updateOffering);
router.delete('/me/offerings/:id', deleteOffering);

router.get('/me/orders', getVendorOrders);
router.patch('/me/orders/:id/status', updateOrderStatus);

// Notifications & Messages
router.get('/me/notifications', getVendorNotifications);
router.patch('/me/notifications/:id/read', markNotificationRead);

router.get('/me/conversations', getVendorConversations);
router.get('/me/conversations/:id/messages', getConversationMessages);
router.post('/me/conversations/:id/messages', sendConversationMessage);

// Storefront Preview
router.get('/me/storefront', getOwnVendorStorefront);

export default router;
