import Order from '../models/orderModel.js';
import OrderSub from '../utils/orderSubscription.js';
import Menu from '../models/menuModel.js';
import Article from '../models/articleModel.js';
import Restaurant from '../models/restaurantModel.js';

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
      if (order.status !== 'En Attente') {
        return res.status(400).send('La commande n\'est pas en attente');
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

      // Check if the order is not already prepared
      if (order.status !== 'En préparation') {
        return res.status(400).send('La commande n\'est pas en préparation');
      }

      // Update the order status
      order.status = 'Préparée';
      await order.save();

      // Notify via websocket
      OrderSub.publish('marketingUpdated');
      OrderSub.publish(`restaurantUpdated-${restaurantId}`, restaurantId);

      return res.status(200).send('Commande préparée avec succès');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  },
  // PUT /order/deliver
  deliver: async (req, res) => {
    // The deliveryman delivers the order
    const { orderId } = req.body;
    const deliverymanId = req.deliveryman._id;

    try {
      // Find the order
      const order = await Order.findById(orderId);

      // Check if the order exists
      if (!order) {
        return res.status(404).send('Commande non trouvée');
      }

      // Check if the order is not already delivered
      if (order.status !== 'Préparée') {
        return res.status(400).send('La commande n\'est pas préparée');
      }

      // Update the order status
      order.status = 'En Livraison';
      order.date_delivered = new Date();
      order.deliveryman_id = deliverymanId;
      await order.save();

      // Notify via websocket
      OrderSub.publish('marketingUpdated');
      OrderSub.publish(`restaurantUpdated-${order.restaurant_id}`, order.restaurant_id);

      return res.status(200).send('Commande en cours de livraison');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  },
  // PUT /order/receive
  receive: async (req, res) => {
    // The client receives the order
    const { orderId } = req.body;

    try {
      // Find the order
      const order = await Order.findById(orderId);

      // Check if the order exists
      if (!order) {
        return res.status(404).send('Commande non trouvée');
      }

      // Check if the user is the owner of the order
      if (order.user_id.toString() !== req.userData.id.toString()) {
        return res.status(400).send('Vous n\'êtes pas autorisé à effectuer cette action');
      }

      // Check if the order is not already delivered
      if (order.status !== 'En Livraison') {
        return res.status(400).send('La commande n\'est pas en livraison');
      }

      // Update the order status
      order.status = 'Livrée';
      await order.save();

      // Notify via websocket
      OrderSub.publish('marketingUpdated');
      OrderSub.publish(`restaurantUpdated-${order.restaurant_id}`, order.restaurant_id);

      return res.status(200).send('Commande livrée avec succès');
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

  if (Orders) {
  // Nombre de commandes
    const orderCount = Orders.length;

    const orderCountsByStatus = await Order.aggregate([
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
      // the order.total_price is a string, so we need to convert it to a number
        return acc + Number(order.total_price);
      }
      return acc;
    }, 0);

    const marketingData = {
      orderCount,
      orderCountsByStatus: formattedCounts,
      orders: Orders,
      totalPrice: totalPriceExcludingCancelled,
    };

    ws.send(JSON.stringify(marketingData));
  } else {
    ws.send('Pas de commandes trouvées');
  }
};

export { orderController, sendMarketingData };
