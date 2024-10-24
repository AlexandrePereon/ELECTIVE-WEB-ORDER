import OrderSub from '../utils/orderSubscription.js';
import { sendMarketingData } from './marketingController.js';

const restaurantSocketController = async (ws, req) => {
  const { restaurant } = req;

  sendMarketingData(ws)(restaurant._id);

  OrderSub.subscribe(`restaurantUpdated-${restaurant._id}`, sendMarketingData(ws));

  ws.on('close', () => {
    OrderSub.unsubscribe(`restaurantUpdated-${restaurant._id}`, sendMarketingData(ws));
  });
};

export default restaurantSocketController;
