import { Router } from 'express';
import { getPublicOfferings, getPublicOfferingBySlug } from '../controllers/offeringController.js';

const router = Router();

router.get('/', getPublicOfferings);
router.get('/:slug', getPublicOfferingBySlug);

export default router;
