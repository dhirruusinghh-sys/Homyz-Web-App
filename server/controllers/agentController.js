import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';

export const getAgentOverview = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user._id });
    const propertyIds = properties.map(p => p._id);
    
    const bookings = await Booking.find({ property: { $in: propertyIds } }).populate('property', 'title');
    
    // Calculate stats
    const totalListings = properties.length;
    const activeListings = properties.filter(p => p.status === 'approved').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    
    res.json({
      totalListings,
      activeListings,
      pendingBookings,
      totalViews: 0, // Placeholder
      recentBookings: bookings.slice(0, 5) // Recent 5
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgentMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ receiver: req.user._id }, { sender: req.user._id }]
    })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
