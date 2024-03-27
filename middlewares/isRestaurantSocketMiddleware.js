export default async function isRestaurantSocketMiddleware(ws, req, next) {
  const { role } = req.userData;

  if (role === 'restaurant') {
    next();
  } else {
    ws.send('Vous n\'avez pas le rôle nécessaire pour accéder à cette ressource.');
    ws.close();
  }
}
