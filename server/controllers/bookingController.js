import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Customer
export const createBooking = async (req, res) => {
  try {
    const { propertyId, visitDate, timeSlot, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if slot is already booked for this property
    const existingBooking = await Booking.findOne({
      property: propertyId,
      visitDate: new Date(visitDate),
      timeSlot,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked or requested.' });
    }

    const booking = new Booking({
      property: propertyId,
      customer: req.user._id,
      agent: property.agent,
      visitDate: new Date(visitDate),
      timeSlot,
      notes,
    });

    const createdBooking = await booking.save();
    await createdBooking.populate('property', 'title');
    await createdBooking.populate('customer', 'name email');
    await createdBooking.populate('agent', 'name email');

    // Send emails
    const customerMessage = `Your visit request for ${createdBooking.property.title} on ${new Date(visitDate).toDateString()} at ${timeSlot} has been received and is pending approval.`;
    const agentMessage = `You have a new visit request for ${createdBooking.property.title} on ${new Date(visitDate).toDateString()} at ${timeSlot} from ${createdBooking.customer.name}.`;

    try {
      await sendEmail({
        email: createdBooking.customer.email,
        subject: 'Booking Request Received',
        message: customerMessage,
      });
      await sendEmail({
        email: createdBooking.agent.email,
        subject: 'New Booking Request',
        message: agentMessage,
      });
    } catch (error) {
      console.log('Email could not be sent', error);
    }

    // Create In-App Notifications
    await Notification.create({
      recipient: createdBooking.customer._id,
      title: 'Booking Requested',
      message: customerMessage,
      type: 'booking'
    });

    await Notification.create({
      recipient: createdBooking.agent._id,
      title: 'New Booking Request',
      message: agentMessage,
      type: 'booking'
    });

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin/Agent/Customer scopes)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    let query = {};
    
    // Scoping based on role
    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'agent') {
      query.agent = req.user._id;
    }
    // Admin sees all by default

    // Filters from query params
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const bookings = await Booking.find(query)
      .populate('property', 'title images address price')
      .populate('customer', 'name email phone avatar')
      .populate('agent', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'title images address price')
      .populate('customer', 'name email phone avatar')
      .populate('agent', 'name email phone avatar');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Auth check
    if (
      req.user.role !== 'admin' &&
      booking.customer._id.toString() !== req.user._id.toString() &&
      booking.agent._id.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Approve, Reject, Cancel, Complete, Reschedule)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, remarks, visitDate, timeSlot } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'title')
      .populate('customer', 'name email')
      .populate('agent', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Role-based auth for status changes
    if (req.user.role === 'customer' && status !== 'cancelled') {
      return res.status(401).json({ message: 'Customers can only cancel bookings.' });
    }
    
    if (req.user.role === 'agent' && booking.agent._id.toString() !== req.user._id.toString()) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = status;
    if (remarks) booking.remarks = remarks;
    
    // Handle reschedule
    if (status === 'rescheduled') {
      if (visitDate) booking.visitDate = new Date(visitDate);
      if (timeSlot) booking.timeSlot = timeSlot;
    }

    const updatedBooking = await booking.save();

    // Send email notification based on status
    let customerSubject = '';
    let customerMessage = '';
    
    switch (status) {
      case 'approved':
        customerSubject = 'Booking Approved';
        customerMessage = `Your visit for ${booking.property.title} on ${new Date(booking.visitDate).toDateString()} at ${booking.timeSlot} has been approved.`;
        break;
      case 'rejected':
        customerSubject = 'Booking Rejected';
        customerMessage = `Your visit request for ${booking.property.title} has been rejected. Remarks: ${remarks || 'None'}`;
        break;
      case 'cancelled':
        customerSubject = 'Booking Cancelled';
        customerMessage = `Your visit for ${booking.property.title} has been cancelled.`;
        break;
      case 'rescheduled':
        customerSubject = 'Booking Rescheduled';
        customerMessage = `Your visit for ${booking.property.title} has been rescheduled to ${new Date(booking.visitDate).toDateString()} at ${booking.timeSlot}.`;
        break;
      case 'completed':
        customerSubject = 'Visit Completed';
        customerMessage = `Thank you for visiting ${booking.property.title}. We hope it met your expectations!`;
        break;
    }

    if (customerSubject) {
      try {
        await sendEmail({
          email: booking.customer.email,
          subject: customerSubject,
          message: customerMessage,
        });
      } catch (error) {
        console.log('Email could not be sent', error);
      }

      // Create In-App Notification
      await Notification.create({
        recipient: booking.customer._id,
        title: customerSubject,
        message: customerMessage,
        type: 'booking'
      });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
