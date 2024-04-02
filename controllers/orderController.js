import Order from '../models/orderModel.js';
import OrderSub from '../utils/orderSubscription.js';
import Menu from '../models/menuModel.js';
import Article from '../models/articleModel.js';
import Restaurant from '../models/restaurantModel.js';
import Notification from '../models/notificationModel.js';

const orderController = {
  // POST /order/create
  create: async (req, res) => {
    // Get the list of menus and articles, from the request
    const { menus, articles, restaurantId } = req.body;

    // Check if the menus or articles are not empty
    if (!menus.length && !articles.length) {
      return res.status(400).send('Menus ou articles non fournis');
    }

    try {
      // Get the restaurant
      const restaurant = await Restaurant.findById(restaurantId);

      // Check if the restaurant exists
      if (!restaurant) {
        return res.status(404).send('Restaurant non trouvé');
      }

      // Get the menus and articles by their IDs and the restaurant
      const menusRestaurant = [...new Set(await Menu.find({ _id: { $in: menus }, restaurant_id: restaurantId }).populate('articles'))];
      const articlesRestaurant = [...new Set(await Article.find({ _id: { $in: articles }, restaurant_id: restaurantId }))];

      // Sum the prices of the menus and articles
      const menusPrice = menusRestaurant.reduce((acc, menu) => acc + menu.price, 0);
      const articlesPrice = articlesRestaurant.reduce((acc, article) => acc + article.price, 0);

      // Check if all products are from the same restaurant
      if (menusRestaurant.length !== new Set(menus).size || articlesRestaurant.length !== new Set(articles).size) {
        return res.status(400).send('Tous les produits ne sont pas du même restaurant');
      }

      const transformedMenus = menusRestaurant.map((menu) => ({
        menu_name: menu.name,
        articles: menu.articles.map((article) => ({
          article_name: article.name,
        })),
        menu_price: menu.price,
      }));

      const transformedArticles = articlesRestaurant.map((article) => ({
        article_name: article.name,
        article_price: article.price,
      }));

      // Create the order
      const order = new Order({
        restaurant_id: restaurantId,
        user_id: req.body.userData.id,
        total_price: menusPrice + articlesPrice,
        date_ordered: new Date(),
        status: 'En Attente',
        menus: transformedMenus,
        articles: transformedArticles,
      });

      // Save the order
      const neworder = await order.save();

      // Notify via websocket
      OrderSub.publish('marketingUpdated');
      OrderSub.publish(`restaurantUpdated-${restaurantId}`, restaurantId);

      const notificationMessage = `Nouvelle commande n°${neworder._id} pour un montant de ${neworder.total_price}€`;
      OrderSub.publish(`sendNotification${restaurant.createur_id}`, restaurant.createur_id, notificationMessage);

      return res.status(200).json({ order: neworder._id, message: 'Commande créée avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  },
  // PUT /order/accept
  accept: async (req, res) => {
    // The restaurant accepts the order
    const { orderId } = req.body;
    const restaurantId = req.restaurant._id;

    console.log(req.body);

    try {
      // Find the order
      const order = await Order.findById(orderId);

      // Check if the order exists
      if (!order) {
        return res.status(404).send('Commande non trouvée');
      }

      // Check if the order is from the same restaurant
      if (order.restaurant_id.toString() !== restaurantId.toString()) {
        return res.status(400).send('Cette commande n\'appartient pas à ce restaurant');
      }

      // Check if the order is not already accepted
      if (order.status === 'En préparation') {
        return res.status(400).send('La commande est déjà en cours de préparation');
      }

      // Update the order status
      order.status = 'En préparation';
      await order.save();

      // Notify via websocket
      OrderSub.publish('marketingUpdated');
      OrderSub.publish(`restaurantUpdated-${restaurantId}`, restaurantId);

      return res.status(200).send('Commande acceptée avec succès');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  },
};

const sendMarketingData = (ws) => async (restaurantId) => {
  let Orders;
  if (restaurantId) {
    Orders = await Order.find({ restaurant_id: restaurantId });
  } else {
    Orders = await Order.find();
  }

  if (Orders && Orders.length > 0) {
    // Nombre de commandes
    const orderCount = Orders.length;

    const orderCountsByStatus = await Order.aggregate([
      {
        $match: restaurantId ? { restaurant_id: restaurantId } : {}, // Filtrer par restaurantId si spécifié
      },
      {
        $group: {
          _id: '$status', // Grouper par le champ 'status'
          count: { $sum: 1 }, // Compter le nombre d'occurrences pour chaque statut
        },
      },
    ]);

    const formattedCounts = orderCountsByStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const totalPriceExcludingCancelled = Orders.reduce((acc, order) => {
      if (order.status !== 'Annulée') {
        // La valeur de order.total_price est une chaîne, donc nous devons la convertir en nombre
        return acc + Number(order.total_price);
      }
      return acc;
    }, 0);

    // Résumé quotidien
    const dailySummary = await Order.aggregate([
      {
        $match: restaurantId ? { restaurant_id: restaurantId } : {},
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date_ordered' } }, // Grouper par jour
          dailyOrderCount: { $sum: 1 }, // Compter le nombre de commandes pour chaque jour
          dailyTotalPrice: { $sum: { $toDouble: '$total_price' } }, // Somme des prix pour le jour
        },
      },
      { $sort: { _id: 1 } }, // Trier par date
    ]);

    const marketingData = {
      orderCount,
      orderCountsByStatus: formattedCounts,
      totalPrice: totalPriceExcludingCancelled,
      dailySummary, // Remplace la liste complète des commandes par le résumé quotidien
    };

    ws.send(JSON.stringify(marketingData));
  } else {
    ws.send('Pas de commandes trouvées');
  }
};

const sendNotifications = (ws) => async (userId) => {
  const notifications = await Notification.find({ user_id: userId, read: false });

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

export {
  orderController, sendMarketingData, sendNotification, sendNotifications,
};
