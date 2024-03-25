import mongoose from 'mongoose';

const { Schema } = mongoose;
const Restaurant = mongoose.model('Order', {
  // Customer, deliman, restaurant, date ordered, date delivered, status, total price
  customer_id: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  deliman_id: {
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
    required: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
    enum: ['En Attente', 'Acceptée', 'Préparée', 'En Livraison', 'Livrée', 'Annulée'],
  },
});

export default Restaurant;
