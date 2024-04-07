import hasRestaurantMiddleware from './hasRestaurantMiddleware.js';

export default async function isUserOrHasRestaurantMiddleware(req, res, next) {
  const { role } = req.body.userData;

  if (role === 'user') {
    next();
  } else if (role === 'restaurant') {
    hasRestaurantMiddleware(req, res, next);
  } else {
    res.status(403).send("Vous n'avez pas le rôle nécessaire pour accéder à cette ressource.");
  }
}
