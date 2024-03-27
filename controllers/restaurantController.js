import OrderSub from '../utils/orderSubscription.js';
import { sendMarketingData } from './orderController.js';

const restaurantSocketController = async (ws, req) => {
  ws.send('Connected to the restaurant socket');
  const { restaurant } = req;

  sendMarketingData(ws)(restaurant._id);

  ws.on('message', (msg) => {
    ws.send(`Message received: ${msg}`);
  });

  OrderSub.subscribe(`restaurantUpdated-${restaurant._id}`, sendMarketingData(ws));

  ws.on('close', () => {
    ws.send('Connection closed');
    OrderSub.unsubscribe(`restaurantUpdated-${restaurant._id}`, sendMarketingData(ws));
  });
};

export default restaurantSocketController;
