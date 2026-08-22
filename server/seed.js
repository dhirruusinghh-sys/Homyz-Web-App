import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Property from './models/Property.js';
import Booking from './models/Booking.js';
import Message from './models/Message.js';
import Blog from './models/Blog.js';
import Category from './models/Category.js';
import Amenity from './models/Amenity.js';
import City from './models/City.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homyz');
    console.log('Connected to MongoDB. Clearing existing data...');

    await User.deleteMany();
    await Property.deleteMany();
    await Booking.deleteMany();
    await Message.deleteMany();
    await Blog.deleteMany();
    await Category.deleteMany();
    await Amenity.deleteMany();
    await City.deleteMany();

    console.log('Existing data cleared.');

    // 1. Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@homyz.com',
      password: 'password123',
      role: 'admin',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
    });

    const agent1 = await User.create({
      name: 'Sarah Agent',
      email: 'sarah@homyz.com',
      password: 'password123',
      role: 'agent',
      agentStatus: 'approved',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    });

    const agent2 = await User.create({
      name: 'Mike Agent',
      email: 'mike@homyz.com',
      password: 'password123',
      role: 'agent',
      agentStatus: 'approved',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop'
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    });

    // 2. Create Categories & Amenities & Cities
    const catVilla = await Category.create({ name: 'Villa', slug: 'villa', icon: 'Home' });
    const catApt = await Category.create({ name: 'Apartment', slug: 'apartment', icon: 'Building' });

    const amPool = await Amenity.create({ name: 'Swimming Pool', icon: 'Droplet' });
    const amGym = await Amenity.create({ name: 'Gym', icon: 'Dumbbell' });
    const amWifi = await Amenity.create({ name: 'High-Speed WiFi', icon: 'Wifi' });

    await City.create({ name: 'New York', state: 'NY', country: 'USA' });
    await City.create({ name: 'Los Angeles', state: 'CA', country: 'USA' });

    // 3. Create Properties
    const prop1 = await Property.create({
      agent: agent1._id,
      title: 'Luxury Villa in Beverly Hills',
      description: 'A stunning 5-bedroom villa with a private pool and panoramic city views.',
      category: catVilla._id,
      propertyType: 'buy',
      price: 4500000,
      bedrooms: 5,
      bathrooms: 6,
      area: 5500,
      address: '123 Beverly Hills Drive',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop'
      ],
      amenities: [amPool._id, amWifi._id],
      featured: true,
      status: 'approved'
    });

    const prop2 = await Property.create({
      agent: agent2._id,
      title: 'Modern Manhattan Penthouse',
      description: 'Luxury penthouse in the heart of Manhattan with skyline views.',
      category: catApt._id,
      propertyType: 'rent',
      price: 15000,
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      address: '456 5th Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      images: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09be1587?q=80&w=1000&auto=format&fit=crop'
      ],
      amenities: [amGym._id, amWifi._id],
      status: 'approved'
    });

    const prop3 = await Property.create({
      agent: agent1._id,
      title: 'Cozy Suburban House',
      description: 'Perfect family home with a large backyard and modern kitchen.',
      category: catVilla._id,
      propertyType: 'buy',
      price: 850000,
      bedrooms: 4,
      bathrooms: 2.5,
      area: 3200,
      address: '789 Maple Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop'
      ],
      amenities: [amWifi._id],
      status: 'pending'
    });

    // 4. Create Bookings
    await Booking.create({
      property: prop2._id,
      customer: customer1._id,
      agent: agent2._id,
      visitDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      timeSlot: '14:00',
      status: 'approved',
      notes: 'Please bring ID'
    });

    await Booking.create({
      property: prop1._id,
      customer: customer1._id,
      agent: agent1._id,
      visitDate: new Date(Date.now() + 86400000 * 5),
      timeSlot: '10:00',
      status: 'pending',
      notes: 'Interested in financing options'
    });

    // 5. Create Messages
    await Message.create({
      sender: customer1._id,
      receiver: agent1._id,
      property: prop1._id,
      content: 'Hi Sarah, is the Beverly Hills villa still available? I would love to schedule a viewing this weekend.',
      status: 'unread'
    });

    await Message.create({
      sender: customer1._id,
      receiver: agent2._id,
      property: prop2._id,
      content: 'Hello Mike, what are the lease terms for the Manhattan Penthouse?',
      status: 'read'
    });

    // 6. Create Blogs
    await Blog.create({
      title: 'Top 10 Real Estate Trends in 2024',
      slug: 'top-10-real-estate-trends-in-2024',
      content: 'The real estate market is constantly evolving...',
      author: admin._id,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
      category: 'Market Trends',
      status: 'published'
    });

    console.log('Database successfully seeded with realistic dummy data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
