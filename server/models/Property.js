import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    propertyType: {
      type: String, // Buy, Rent, Commercial, Residential
      required: true,
      enum: ['buy', 'rent', 'commercial', 'residential'],
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    
    // Details
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    kitchen: { type: Number, default: 0 },
    parking: { type: Number, default: 0 },
    area: { type: Number, required: true }, // SqFt or SqM
    floors: { type: Number, default: 1 },
    furnished: {
      type: String,
      enum: ['furnished', 'semi-furnished', 'unfurnished'],
      default: 'unfurnished',
    },
    constructionYear: { type: Number },
    
    // Location
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'US' },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    googleMapsLink: { type: String },
    
    // Media
    images: [{ type: String, required: true }],
    videos: [{ type: String }],
    virtualTour: { type: String }, // Link to Matterport or 360 viewer
    floorPlans: [{ type: String }],
    
    // Features & Amenities
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity',
      },
    ],
    
    // Nearby (AI Suggested or Manual)
    nearbySchools: [{ name: String, distance: String }],
    nearbyHospital: [{ name: String, distance: String }],
    nearbyMetro: [{ name: String, distance: String }],
    nearbyMall: [{ name: String, distance: String }],
    
    // Badges
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold', 'rented'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
