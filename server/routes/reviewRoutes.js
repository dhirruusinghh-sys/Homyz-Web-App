import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createReview,
  getCustomerReviews,
  getPropertyReviews,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/customer')
  .get(protect, getCustomerReviews);

router.route('/property/:propertyId')
  .get(getPropertyReviews); // Public

router.route('/:id')
  .delete(protect, deleteReview);

export default router;
