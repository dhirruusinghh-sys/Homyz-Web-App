import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only review a property once
reviewSchema.index({ property: 1, customer: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
