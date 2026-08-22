import express from 'express';
import { protect, agent } from '../middlewares/authMiddleware.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// @desc    Get agent analytics (Mocked/Aggregated data for demo)
// @route   GET /api/agent/analytics
// @access  Private/Agent
router.get('/', protect, agent, async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments({ agent: req.user._id });
    const pendingRequests = await Booking.countDocuments({ agent: req.user._id, status: 'pending' });
    const completedRequests = await Booking.countDocuments({ agent: req.user._id, status: 'completed' });

    // Mock data for charts
    const revenueData = [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 22000 },
      { month: 'Mar', revenue: 18000 },
      { month: 'Apr', revenue: 28000 },
      { month: 'May', revenue: 25000 },
      { month: 'Jun', revenue: 35000 },
    ];

    const viewsData = [
      { month: 'Jan', views: 400 },
      { month: 'Feb', views: 650 },
      { month: 'Mar', views: 900 },
      { month: 'Apr', views: 1200 },
      { month: 'May', views: 1500 },
      { month: 'Jun', views: 2100 },
    ];

    res.json({
      overview: {
        totalProperties,
        pendingRequests,
        completedRequests,
        totalRevenue: '$143,000',
        totalLeads: 148,
      },
      charts: {
        revenueData,
        viewsData,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
