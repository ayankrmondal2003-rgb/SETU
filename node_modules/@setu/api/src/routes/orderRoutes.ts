import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createOrder, getTouristOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';

const router = Router();

router.use(requireAuth);

router.post('/', createOrder);
router.get('/', getTouristOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

export default router;
