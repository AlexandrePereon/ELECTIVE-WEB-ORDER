import OrderSub from '../utils/orderSubscription.js';
import Order from '../models/orderModel.js';

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

const marketingSocketController = async (ws) => {
  sendMarketingData(ws)();

  OrderSub.subscribe('marketingUpdated', sendMarketingData(ws));

  ws.on('close', () => {
    OrderSub.unsubscribe('marketingUpdated', sendMarketingData(ws));
  });
};

export { sendMarketingData, marketingSocketController };
