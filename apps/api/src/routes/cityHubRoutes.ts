import { Router } from 'express';
import { getCityHubs, getCityHubBySlug } from '../controllers/cityHubController.js';

const router = Router();

router.get('/city-hubs', getCityHubs);
router.get('/city-hubs/:slug', getCityHubBySlug);

export default router;
