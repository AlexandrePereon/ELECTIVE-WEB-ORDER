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

const createNotification = async (userId, message) => {
  // Créer une nouvelle notification
  const notification = new Notification({
    user_id: userId,
    message,
  });

  // Enregistrer la notification
  await notification.save();

  // Envoyer la notification
  OrderSub.publish(`sendNotifications${userId}`, userId);
};

const notificationSocketController = async (ws, req) => {
  const { id } = req.userData;

  sendNotifications(ws)(id);

  OrderSub.subscribe(`sendNotifications${id}`, sendNotifications(ws));

  ws.on('close', () => {
    OrderSub.unsubscribe(`sendNotifications${id}`, sendNotifications(ws));
  });
};

const notificationController = {
// PUT /order/notified
  notified: async (req, res) => {
  // Change all notifications from a user to seen
    const { id } = req.body.userData;

    try {
    // Find the notifications
      await Notification.updateMany({ user_id: id, seen: null }, { seen: new Date() });

      return res.status(200).send('Notifications marquées comme lues');
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
};

export { notificationSocketController, notificationController, createNotification };
