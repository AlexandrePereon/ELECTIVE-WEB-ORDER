import mongoose from 'mongoose';

const { Schema } = mongoose;
const Order = mongoose.model('Order', {
  user_id: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  deliveryman_id: {
    type: Number,
    required: false,
    unique: true,
    trim: true,
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  date_ordered: {
    type: Date,
    required: true,
  },
  date_delivered: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: true,
    trim: true,
    enum: ['En Attente', 'En préparation', 'Préparée', 'En Livraison', 'Livrée', 'Annulée'],
  },
  menus: [{
    menu_name: {
      type: String,
      required: true,
    },
    articles: [{
      article_name: {
        type: String,
        required: true,
      },
    }],
    menu_price: {
      type: String,
      required: true,
    },
  }],
  articles: [{
    article_name: {
      type: String,
      required: true,
    },
    article_price: {
      type: String,
      required: true,
    },
  }],
  total_price: {
    type: String,
    required: true,
  },
});

export default Order;
