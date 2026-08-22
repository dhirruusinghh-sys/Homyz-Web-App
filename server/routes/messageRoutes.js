import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { sendMessage, getMessages } from '../controllers/messageController.js';

const router = express.Router();

router.route('/')
  .get(protect, getMessages)
  .post(protect, sendMessage);

export default router;
