import Order from '../models/orderModel.js';
import Menu from '../models/menuModel.js';
import Article from '../models/articleModel.js';
import Restaurant from '../models/restaurantModel.js';
import { createNotifications } from './notificationController.js';
import { updatedMarketingData } from './marketingController.js';

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
      const notificationMessage = `Nouvelle commande n°${neworder._id} pour un montant de ${neworder.total_price}€`;
      createNotifications([order.user_id, restaurant.createur_id], notificationMessage);
      updatedMarketingData(restaurantId);

      return res.status(200).json({ order: neworder._id, message: 'Commande créée avec succès' });
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // PUT /order/accept
  accept: async (req, res) => {
    // The restaurant accepts the order
    const { orderId } = req.body;
    const restaurantId = req.restaurant._id;

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

      // find restaurant
      const restaurant = await Restaurant.findById(restaurantId);

      // Check if the restaurant exists
      if (!restaurant) {
        return res.status(404).send('Restaurant non trouvé');
      }

      // Check if the order is not already accepted
      if (order.status !== 'En Attente') {
        return res.status(400).send('La commande n\'est pas en attente');
      }

      // Update the order status
      order.status = 'En préparation';
      await order.save();

      // Notify via websocket
      const notificationMessage = `La commande n°${order._id} a été acceptée`;
      createNotifications([order.user_id, restaurant.createur_id], notificationMessage);
      updatedMarketingData(restaurantId);

      return res.status(200).send('Commande acceptée avec succès');
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // PUT /order/prepared
  prepared: async (req, res) => {
    // The restaurant has prepared the order
    const { orderId } = req.body;
    const restaurantId = req.restaurant._id;

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

      // find restaurant
      const restaurant = await Restaurant.findById(restaurantId);

      // Check if the restaurant exists
      if (!restaurant) {
        return res.status(404).send('Restaurant non trouvé');
      }

      // Check if the order is not already prepared
      if (order.status !== 'En préparation') {
        return res.status(400).send('La commande n\'est pas en préparation');
      }

      // Update the order status
      order.status = 'Préparée';
      await order.save();

      // Notify via websocket
      const notificationMessage = `La commande n°${order._id} à été préparée`;
      createNotifications([order.user_id, restaurant.createur_id], notificationMessage);
      updatedMarketingData(restaurantId);

      return res.status(200).send('Commande préparée avec succès');
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // PUT /order/deliver
  deliver: async (req, res) => {
    // The deliveryman delivers the order
    const { orderId } = req.body;
    const deliverymanId = req.body.userData.id;

    try {
      // Find the order
      const order = await Order.findById(orderId);

      // Check if the order exists
      if (!order) {
        return res.status(404).send('Commande non trouvée');
      }

      // find restaurant
      const restaurant = await Restaurant.findById(order.restaurant_id);

      // Check if the restaurant exists
      if (!restaurant) {
        return res.status(404).send('Restaurant non trouvé');
      }

      // Check if the order is not already delivered
      if (order.status !== 'Préparée') {
        return res.status(400).send('La commande n\'est pas préparée');
      }

      // Update the order status
      order.status = 'En Livraison';
      order.deliveryman_id = deliverymanId;
      await order.save();

      // Notify via websocket
      const notificationMessage = `La commande n°${order._id} est en cours de livraison`;
      createNotifications([order.user_id, restaurant.createur_id, order.deliveryman_id], notificationMessage);
      updatedMarketingData(order.restaurant_id);

      return res.status(200).send('Commande en cours de livraison');
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // PUT /order/receive
  delivered: async (req, res) => {
    // The deliveryman has delivered the order
    const { orderId } = req.body;
    const deliverymanId = req.body.userData.id;

    try {
      // Find the order
      const order = await Order.findById(orderId);

      // Check if the order exists
      if (!order) {
        return res.status(404).send('Commande non trouvée');
      }

      // Check if the deliveryman is the one who has to deliver the order
      if (order.deliveryman_id !== deliverymanId) {
        return res.status(400).send('Vous n\'êtes pas autorisé à effectuer cette action');
      }

      // find restaurant
      const restaurant = await Restaurant.findById(order.restaurant_id);

      // Check if the restaurant exists
      if (!restaurant) {
        return res.status(404).send('Restaurant non trouvé');
      }

      // Check if the order is not already delivered
      if (order.status !== 'En Livraison') {
        return res.status(400).send('La commande n\'est pas en livraison');
      }

      // Update the order status
      order.status = 'Livrée';
      order.date_delivered = new Date();
      await order.save();

      // Notify via websocket
      const notificationMessage = `La commande n°${order._id} a été livrée`;
      createNotifications([order.user_id, restaurant.createur_id, order.deliveryman_id], notificationMessage);
      updatedMarketingData(order.restaurant_id);

      return res.status(200).send('Commande livrée avec succès');
    } catch (error) {
      console.log(error);
      return res.status(500).send('Internal server error');
    }
  },
  // GET /order/waiting
  getWaitingOrders: async (req, res) => {
    // Get the waiting orders of the restaurant or the client
    console.log(req.userData);

    const { restaurant } = req;
    const { id, role } = req.body.userData;

    try {
      let orders;

      if (role === 'restaurant') {
        // Get the waiting orders of the restaurant
        orders = await Order.find({ restaurant_id: restaurant._id, status: 'En Attente' }).sort({ date_ordered: 'desc' });
      } else if (role === 'user') {
        // Get the waiting orders of the client
        orders = await Order.find({ user_id: id, status: 'En Attente' }).sort({ date_ordered: 'desc' });
      }

      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // GET /order/active
  getActiveOrders: async (req, res) => {
    // Get the active orders of the restaurant or the client
    const { restaurant } = req;
    const { id, role } = req.body.userData;

    try {
      let orders;

      if (role === 'restaurant') {
        // Get the active orders of the restaurant
        orders = await Order.find({ restaurant_id: restaurant._id, status: { $in: ['En préparation', 'Préparée', 'En Livraison'] } }).sort({ date_ordered: 'desc' });
      } else if (role === 'user') {
        // Get the active orders of the client
        orders = await Order.find({ user_id: id, status: { $in: ['En préparation', 'Préparée', 'En Livraison'] } }).sort({ date_ordered: 'desc' });
      }

      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // GET /order/inactive
  getInactiveOrders: async (req, res) => {
    // Get the inactive orders of the restaurant or the client
    const { restaurant } = req;
    const { id, role } = req.body.userData;

    try {
      let orders;

      if (role === 'restaurant') {
        // Get the inactive orders of the restaurant
        orders = await Order.find({ restaurant_id: restaurant._id, status: { $in: ['Livrée', 'Annulée'] } }).sort({ date_ordered: 'desc' });
      } else if (role === 'user') {
        // Get the inactive orders of the client
        orders = await Order.find({ user_id: id, status: { $in: ['Livrée', 'Annulée'] } }).sort({ date_ordered: 'desc' });
      }

      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // GET /order/to-deliver
  getOrdersToDeliver: async (req, res) => {
    // Get the orders ready to deliver for a deliveryman
    try {
      const orders = await Order.find({ status: 'Préparée' }).sort({ date_ordered: 'desc' });

      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
  // GET /order/in-delivery
  getOrdersInDelivery: async (req, res) => {
    const { id } = req.body.userData;

    try {
      const orders = await Order.find({ deliveryman_id: id, status: 'En Livraison' }).sort({ date_ordered: 'desc' });

      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  },
};

export default orderController;
