import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      area: { type: String, default: 'Kikoni' },
      address: String,
    },
    images: [
      {
        type: String, // Array of image URLs
        required: true,
      },
    ],
    amenities: [String], // e.g., ["WiFi", "Shuttle", "Gym"]
    priceRange: {
      min: Number,
      max: Number,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    custodian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;