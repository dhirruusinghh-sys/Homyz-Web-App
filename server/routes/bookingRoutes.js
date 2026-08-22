import express from 'express';
import { protect, admin, agent } from '../middlewares/authMiddleware.js';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, admin, deleteBooking); // Only admin can hard delete

router.route('/:id/status')
  .put(protect, updateBookingStatus);

export default router;
