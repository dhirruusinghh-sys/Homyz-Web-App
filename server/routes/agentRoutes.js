import express from 'express';
import { protect, agent } from '../middlewares/authMiddleware.js';
import { getAgentOverview, getAgentMessages } from '../controllers/agentController.js';

const router = express.Router();

router.get('/overview', protect, agent, getAgentOverview);
router.get('/messages', protect, agent, getAgentMessages);

export default router;
