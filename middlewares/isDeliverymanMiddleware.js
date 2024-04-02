export default async function isdDeliverymanMiddleware(req, res, next) {
  const { role } = req.body.userData;

  if (role === 'deliveryman') {
    next();
  } else {
    res.status(401).send("Vous n'avez pas le rôle nécessaire pour accéder à cette ressource.");
  }
}
