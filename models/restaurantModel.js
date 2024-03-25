import mongoose from 'mongoose';

const Restaurant = mongoose.model('Restaurant', {
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createur_id: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
});

export default Restaurant;
