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
  seen: {
    type: Date,
    default: null,
  },
});

export default Notification;
