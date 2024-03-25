import Order from '../models/orderModel.js';

const restaurantController = {
  // POST /order/create
  create: async (req, res) => {
    const restaurantExists = await Order.findOne({
      $or: [
        { createur_id: req.body.userData.id },
      ],
    });

    if (restaurantExists) {
      return res.status(400).json({
        message: 'The user already has a restaurant',
      });
    }

    const restaurantNameExists = await Order.findOne({
      $or: [
        { name: req.body.name },
      ],
    });

    if (restaurantNameExists) {
      return res.status(400).json({
        message: 'The restaurant already exists',
      });
    }

    // create new restaurant
    const restaurant = new Order({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      createur_id: req.body.userData.id,
    });

    try {
      const createdRestaurant = await restaurant.save();
      return res.json({ id: createdRestaurant._id });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
};

export default restaurantController;
