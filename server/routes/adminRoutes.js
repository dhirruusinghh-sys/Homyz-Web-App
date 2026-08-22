import express from 'express';
import { 
  getUsers, updateUserStatus, 
  getAgents, updateAgentStatus,
  getAdminOverview,
  getAdminProperties, updatePropertyStatus
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/overview', protect, admin, getAdminOverview);
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id/status').put(protect, admin, updateUserStatus);
router.route('/agents').get(protect, admin, getAgents);
router.route('/agents/:id/status').put(protect, admin, updateAgentStatus);
router.route('/properties').get(protect, admin, getAdminProperties);
router.route('/properties/:id/status').put(protect, admin, updatePropertyStatus);

import { 
  getCategories, createCategory, deleteCategory,
  getAmenities, createAmenity, deleteAmenity,
  getCities, createCity, deleteCity
} from '../controllers/masterDataController.js';

router.route('/categories').get(protect, admin, getCategories).post(protect, admin, createCategory);
router.route('/categories/:id').delete(protect, admin, deleteCategory);

router.route('/amenities').get(protect, admin, getAmenities).post(protect, admin, createAmenity);
router.route('/amenities/:id').delete(protect, admin, deleteAmenity);

router.route('/cities').get(protect, admin, getCities).post(protect, admin, createCity);
router.route('/cities/:id').delete(protect, admin, deleteCity);

import {
  getAdminBookings, getAdminMessages,
  getBlogs, createBlog, deleteBlog,
  getNewsletters, deleteNewsletter
} from '../controllers/adminController.js';

router.get('/bookings', protect, admin, getAdminBookings);
router.get('/messages', protect, admin, getAdminMessages);

router.route('/blogs').get(protect, admin, getBlogs).post(protect, admin, createBlog);
router.route('/blogs/:id').delete(protect, admin, deleteBlog);

router.route('/newsletters').get(protect, admin, getNewsletters);
router.route('/newsletters/:id').delete(protect, admin, deleteNewsletter);

export default router;
