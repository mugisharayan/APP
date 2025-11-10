import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hostel from '../models/hostel.model.js';
import User from '../models/user.model.js';

dotenv.config();

const sampleHostels = [
  {
    name: 'Makerere Heights Hostel',
    location: 'Kikoni',
    description: 'Modern hostel with excellent facilities near Makerere University',
    contact: '+256 700 123 456',
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
    ],
    amenities: [
      { name: 'WiFi', icon: 'fa-wifi' },
      { name: 'Security', icon: 'fa-shield-alt' },
      { name: 'Kitchen', icon: 'fa-utensils' },
      { name: 'Laundry', icon: 'fa-tshirt' }
    ],
    rooms: [
      { name: 'Single', price: 450000, description: 'Private single room', icon: 'fa-bed' },
      { name: 'Double', price: 650000, description: 'Shared double room', icon: 'fa-bed' }
    ],
    priceRange: { min: 450000, max: 650000 },
    totalRooms: 2,
    slug: 'makerere-heights-hostel'
  },
  {
    name: 'University Gardens Hostel',
    location: 'Wandegeya',
    description: 'Affordable accommodation with great amenities',
    contact: '+256 700 987 654',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    amenities: [
      { name: 'WiFi', icon: 'fa-wifi' },
      { name: 'Parking', icon: 'fa-car' },
      { name: 'Generator', icon: 'fa-bolt' }
    ],
    rooms: [
      { name: 'Single', price: 350000, description: 'Cozy single room', icon: 'fa-bed' },
      { name: 'Shared', price: 250000, description: 'Shared accommodation', icon: 'fa-users' }
    ],
    priceRange: { min: 250000, max: 350000 },
    totalRooms: 2,
    slug: 'university-gardens-hostel'
  }
];

const seedHostels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create sample custodians first
    const custodian1 = await User.create({
      name: 'John Custodian',
      email: 'custodian1@example.com',
      password: 'password123',
      role: 'custodian'
    });

    const custodian2 = await User.create({
      name: 'Jane Custodian',
      email: 'custodian2@example.com',
      password: 'password123',
      role: 'custodian'
    });

    // Add custodian IDs to hostels
    sampleHostels[0].custodian = custodian1._id;
    sampleHostels[1].custodian = custodian2._id;

    // Clear existing hostels and add sample ones
    await Hostel.deleteMany({});
    await Hostel.insertMany(sampleHostels);

    console.log('Sample hostels added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hostels:', error);
    process.exit(1);
  }
};

seedHostels();