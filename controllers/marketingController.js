import OrderSub from '../utils/orderSubscription.js';
import { sendMarketingData } from './orderController.js';

const marketingSocketController = async (ws) => {
  sendMarketingData(ws)();

  OrderSub.subscribe('marketingUpdated', sendMarketingData(ws));

  ws.on('close', () => {
    ws.send('Connection closed');
    OrderSub.unsubscribe('marketingUpdated', sendMarketingData(ws));
  });
};

export default marketingSocketController;
