import Stripe from 'stripe';
import Booking from '../models/Booking.js';

let stripe;
try {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error("Stripe key error:", error);
}

// @desc    Create Stripe Checkout Session for a Booking
// @route   POST /api/payments/create-checkout-session
// @access  Private/Customer
export const createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured properly.' });
    }
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('property');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ message: 'Booking must be approved before payment' });
    }
    
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking is already paid' });
    }

    // Fixed token amount for demo
    const tokenAmount = 500; // $500

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Token Payment for ${booking.property.title}`,
              description: `Booking ID: ${booking.bookingId}`,
            },
            unit_amount: tokenAmount * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173'}/dashboard/customer/payments`,
      client_reference_id: booking._id.toString(),
      metadata: {
        bookingId: booking._id.toString(),
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
