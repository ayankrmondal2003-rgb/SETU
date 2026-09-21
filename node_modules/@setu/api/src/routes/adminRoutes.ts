import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  getAdminStats,
  getAllVendors,
  updateVendorStatus,
  getAllUsers,
  getAllOrders
} from '../controllers/adminController.js';

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireRole('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/vendors', getAllVendors);
router.patch('/vendors/:id/status', updateVendorStatus);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);

export default router;
