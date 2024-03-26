import mongoose from 'mongoose';

const { Schema } = mongoose;
const Menu = mongoose.model('Menu', {
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    unique: false,
    trim: true,
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
});

export default Menu;
