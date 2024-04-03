import OrderSub from '../utils/orderSubscription.js';
import Notification from '../models/notificationModel.js';

const sendNotifications = (ws) => async (userId) => {
  const notifications = await Notification.find(
    {
      user_id: userId,
      $or: [{ seen: null },
        { seen: { $gt: new Date(Date.now() - 600000) } }],
    },
  );

  if (notifications && notifications.length > 0) {
    ws.send(JSON.stringify(notifications));
  } else {
    ws.send('Pas de notifications');
  }
};

const sendNotification = (ws) => async (userId, message) => {
  // Créer une nouvelle notification
  const notification = new Notification({
    user_id: userId,
    message,
  });

  // Enregistrer la notification
  await notification.save();

  // Envoyer les notifications
  sendNotifications(ws)(userId);
};

const notificationSocketController = async (ws, req) => {
  const { id } = req.userData;

  sendNotifications(ws)(id);

  OrderSub.subscribe(`sendNotification${id}`, sendNotification(ws));

  ws.on('close', () => {
    OrderSub.unsubscribe(`sendNotification${id}`, sendNotification(ws));
  });
};

export default notificationSocketController;
