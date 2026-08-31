import Review from '../models/Review.js';
import Property from '../models/Property.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Customer
export const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      property: propertyId,
      customer: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this property.' });
    }

    const review = new Review({
      property: propertyId,
      customer: req.user._id,
      rating: Number(rating),
      comment,
    });

    const createdReview = await review.save();
    
    // Populate property details before sending response to frontend
    await createdReview.populate('property', 'title images');
    
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all reviews by current customer
// @route   GET /api/reviews/customer
// @access  Private/Customer
export const getCustomerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user._id })
      .populate('property', 'title images')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Auth check: User can only delete their own review (or admin can delete any)
    if (review.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
       return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
