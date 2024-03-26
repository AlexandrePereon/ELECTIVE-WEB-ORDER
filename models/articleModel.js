import mongoose from 'mongoose';

const { Schema } = mongoose;

const Article = mongoose.model('Article', {
  name: {
    type: String,
    required: true,
    unique: false,
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
    unique: false,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    unique: false,
    trim: true,
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
});

export default Article;
