import Property from '../models/Property.js';

// @desc    Fetch all properties (with filtering, search, pagination)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    
    // Build query object based on req.query filters
    const query = {};
    
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { city: { $regex: req.query.keyword, $options: 'i' } },
        { address: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }
    
    if (req.query.propertyType) query.propertyType = req.query.propertyType;
    if (req.query.bedrooms) query.bedrooms = { $gte: Number(req.query.bedrooms) };
    if (req.query.bathrooms) query.bathrooms = { $gte: Number(req.query.bathrooms) };
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.amenities) {
      const amenitiesArr = req.query.amenities.split(',');
      query.amenities = { $all: amenitiesArr };
    }
    
    // Only show approved properties by default for public
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'agent')) {
      query.status = 'approved';
    }

    let sortObj = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sortObj = { price: 1 };
    if (req.query.sort === 'price_desc') sortObj = { price: -1 };
    if (req.query.sort === 'oldest') sortObj = { createdAt: 1 };

    const count = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('category', 'name slug')
      .populate('agent', 'name avatar email')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortObj);

    res.json({ properties, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('category', 'name icon slug')
      .populate('agent', 'name avatar email')
      .populate('amenities', 'name icon');

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch agent's properties
// @route   GET /api/properties/agent
// @access  Private/Agent
export const getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Agent
export const createProperty = async (req, res) => {
  try {
    const {
      title, description, category, propertyType, price,
      area, address, city, state, country,
      bedrooms, bathrooms, amenities, googleMapsLink
    } = req.body;
    
    // Extract file URLs from multer fields
    const images = req.files && req.files.images ? req.files.images.map(file => file.path) : [];
    const videos = req.files && req.files.videos ? req.files.videos.map(file => file.path) : [];
    const floorPlans = req.files && req.files.floorPlans ? req.files.floorPlans.map(file => file.path) : [];

    // Parse amenities if it's sent as a stringified array
    let parsedAmenities = [];
    if (amenities) {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        parsedAmenities = Array.isArray(amenities) ? amenities : [amenities];
      }
    }
    
    const property = new Property({
      agent: req.user._id,
      title,
      description,
      category,
      propertyType,
      price,
      area,
      address,
      city,
      state,
      country,
      bedrooms,
      bathrooms,
      images,
      videos,
      floorPlans,
      googleMapsLink,
      amenities: parsedAmenities,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Agent
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership or admin status
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to update this property' });
    }

    // Update fields
    const fieldsToUpdate = ['title', 'description', 'price', 'area', 'bedrooms', 'bathrooms', 'status', 'googleMapsLink'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    if (req.body.amenities) {
      try {
        property.amenities = JSON.parse(req.body.amenities);
      } catch (e) {
        property.amenities = Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities];
      }
    }

    // Append new media if uploaded
    if (req.files) {
      if (req.files.images) {
        property.images = [...property.images, ...req.files.images.map(f => f.path)];
      }
      if (req.files.videos) {
        property.videos = [...property.videos, ...req.files.videos.map(f => f.path)];
      }
      if (req.files.floorPlans) {
        property.floorPlans = [...property.floorPlans, ...req.files.floorPlans.map(f => f.path)];
      }
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Agent
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment property views
// @route   POST /api/properties/:id/view
// @access  Public
export const incrementPropertyViews = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Views incremented', views: property.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
