import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
  incrementPropertyViews
} from '../controllers/propertyController.js';
import { protect, agent } from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

const propertyUploads = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 2 },
  { name: 'floorPlans', maxCount: 5 }
]);

router.route('/')
  .get(getProperties)
  .post(protect, agent, propertyUploads, createProperty);

router.route('/agent')
  .get(protect, agent, getAgentProperties);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, agent, propertyUploads, updateProperty)
  .delete(protect, agent, deleteProperty);

router.post('/:id/view', incrementPropertyViews);

export default router;
