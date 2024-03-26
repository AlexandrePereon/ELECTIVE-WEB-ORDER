import Order from '../models/orderModel.js';
import OrderSub from '../utils/orderSubscription.js';

const orderController = {
  // POST /order/create
  create: async (req, res) => {
    console.log('Order Called');
    OrderSub.publish('commandePayee', { orderCreated: { order: 'order' } });

    return res.status(201).json({ message: 'Order created successfully' });
  },
};

export default orderController;
