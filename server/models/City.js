import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      default: 'US',
    }
  },
  {
    timestamps: true,
  }
);

const City = mongoose.model('City', citySchema);
export default City;
