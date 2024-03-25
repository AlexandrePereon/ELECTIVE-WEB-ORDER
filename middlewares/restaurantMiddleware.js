import Restaurant from '../models/restaurantModel.js';

export default async function restaurantMiddleware(req, res, next) {
  const { role, id } = req.body.userData;

  if (role === 'restaurant') {
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
  } else {
    res.status(401).send('Unauthorized');
  }
}
