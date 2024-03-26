export default async function isRestaurantMiddleware(req, res, next) {
  const { role } = req.body.userData;

  if (role === 'restaurant') {
    next();
  } else {
    res.status(401).send("Vous n'avez pas le rôle nécessaire pour accéder à cette ressource.");
  }
}
