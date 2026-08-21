import { Router } from 'express';
import {
  getCircuits, getCircuitBySlug,
  getDestinations, getDestinationBySlug,
  getDistricts, getDistrictBySlug,
  getEvents, getEventBySlug,
  getCuisineItems, getCuisineItemBySlug
} from '../controllers/tourismController.js';
import { getPublicVendors } from '../controllers/vendorController.js';

const router = Router();

router.get('/circuits', getCircuits);
router.get('/circuits/:slug', getCircuitBySlug);

router.get('/destinations', getDestinations);
router.get('/destinations/:slug', getDestinationBySlug);

router.get('/districts', getDistricts);
router.get('/districts/:slug', getDistrictBySlug);

router.get('/events', getEvents);
router.get('/events/:slug', getEventBySlug);

router.get('/cuisine', getCuisineItems);
router.get('/cuisine/:slug', getCuisineItemBySlug);

router.get('/vendors', getPublicVendors);

export default router;
