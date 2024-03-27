import OrderSub from '../utils/orderSubscription.js';
import { sendMarketingData } from './orderController.js';

const marketingSocketController = async (ws) => {
  ws.send('Connected to the marketing socket');

  sendMarketingData(ws)();

  ws.on('message', (msg) => {
    ws.send(`Message received: ${msg}`);
  });

  OrderSub.subscribe('marketingUpdated', sendMarketingData(ws));

  ws.on('close', () => {
    ws.send('Connection closed');
    OrderSub.unsubscribe('marketingUpdated', sendMarketingData(ws));
  });
};

export default marketingSocketController;
