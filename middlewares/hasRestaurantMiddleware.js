import Restaurant from '../models/restaurantModel.js';

export default async function hasRestaurantMiddleware(req, res, next) {
  const { id } = req.body.userData;

  // Vérifier si le restaurant existe
  const restaurantFound = await Restaurant.findOne({ createur_id: id });
  if (!restaurantFound) {
    res.status(400).json({
      message: 'Aucun restaurant trouvé pour cet utilisateur.',
    });
  } else {
    req.restaurant = restaurantFound;
    next();
  }
}
