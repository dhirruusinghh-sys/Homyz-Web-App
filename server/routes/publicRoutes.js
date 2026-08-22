import express from 'express';
import { getCategories, getAmenities, getCities } from '../controllers/masterDataController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/amenities', getAmenities);
router.get('/cities', getCities);

export default router;
