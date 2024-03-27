import Restaurant from '../models/restaurantModel.js';

export default async function hasRestaurantSocketMiddleware(ws, req, next) {
  const { id } = req.userData;

  // Vérifier si le restaurant existe
  const restaurantFound = await Restaurant.findOne({ createur_id: id });
  if (!restaurantFound) {
    ws.send('Vous n\'avez pas de restaurant associé à votre compte. Créez un restaurant pour continuer.');
    ws.close();
  } else {
    req.restaurant = restaurantFound;
    next();
  }
}
