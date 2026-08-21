import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:type/:id', removeFavorite);
router.delete('/:destinationId', removeFavorite);

export default router;
