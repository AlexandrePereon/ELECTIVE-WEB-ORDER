export default async function isDeliverymanMiddleware(req, res, next) {
  const { role } = req.body.userData;

  if (role === 'deliveryman') {
    next();
  } else {
    res.status(403).json({ message: 'Vous n\'avez pas le rôle nécessaire pour accéder à cette ressource.' });
  }
}
