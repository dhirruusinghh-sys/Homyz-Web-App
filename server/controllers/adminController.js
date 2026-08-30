import User from '../models/User.js';
import Property from '../models/Property.js';

// @desc    Get all users (customers)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status (ban/unban)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = req.body.status || user.status;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all agents
// @route   GET /api/admin/agents
// @access  Private/Admin
export const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update agent status (verify/suspend)
// @route   PUT /api/admin/agents/:id/status
// @access  Private/Admin
export const updateAgentStatus = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    agent.agentStatus = req.body.agentStatus || agent.agentStatus;
    await agent.save();
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Admin Dashboard Overview Stats
// @route   GET /api/admin/overview
// @access  Private/Admin
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalProperties = await Property.countDocuments();
    
    // Calculate property stats (added vs sold) for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const propAggregation = await Property.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          added: { $sum: 1 },
          sold: { 
            $sum: { $cond: [{ $eq: ["$status", "sold"] }, 1, 0] } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const propertiesData = propAggregation.map(item => ({
      name: monthNames[item._id - 1],
      added: item.added,
      sold: item.sold
    }));
    
    // Fill missing months if there's no data
    if (propertiesData.length === 0) {
      const currentMonth = new Date().getMonth();
      for (let i = 5; i >= 0; i--) {
        let m = currentMonth - i;
        if (m < 0) m += 12;
        propertiesData.push({ name: monthNames[m], added: 0, sold: 0 });
      }
    }

    // Mock revenue data for now
    const revenueData = [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 },
      { name: 'Jul', value: 3490 },
    ];

    res.json({
      totalUsers,
      totalAgents,
      totalProperties,
      totalRevenue: '$345,000',
      propertiesData,
      revenueData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties (for admin)
// @route   GET /api/admin/properties
// @access  Private/Admin
export const getAdminProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('agent', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property status
// @route   PUT /api/admin/properties/:id/status
// @access  Private/Admin
export const updatePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = req.body.status || property.status;
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Booking from '../models/Booking.js';
import Message from '../models/Message.js';
import Blog from '../models/Blog.js';
import Newsletter from '../models/Newsletter.js';

// ---- PHASE 3 CONTROLLERS ----

export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('agent', 'name').populate('customer', 'name');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).populate('sender', 'name email');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Blogs
export const getBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
};
export const createBlog = async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
};
export const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
};

// Newsletter
export const getNewsletters = async (req, res) => {
  const newsletters = await Newsletter.find({});
  res.json(newsletters);
};
export const deleteNewsletter = async (req, res) => {
  await Newsletter.findByIdAndDelete(req.params.id);
  res.json({ message: 'Subscriber deleted' });
};
