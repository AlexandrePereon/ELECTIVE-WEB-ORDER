import OrderSub from '../utils/orderSubscription.js';
import { sendNotifications, sendNotification } from './orderController.js';

const notificationSocketController = async (ws, req) => {
  const { id } = req.userData;

  sendNotifications(ws)(id);

  OrderSub.subscribe(`sendNotification${id}`, sendNotification(ws));

  ws.on('close', () => {
    OrderSub.unsubscribe(`sendNotification${id}`, sendNotification(ws));
  });
};

export default notificationSocketController;
