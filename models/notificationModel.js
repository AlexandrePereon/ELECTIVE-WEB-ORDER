import mongoose from 'mongoose';

const Notification = mongoose.model('Notification', {
  user_id: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    trim: true,
    default: Date.now,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default Notification;
