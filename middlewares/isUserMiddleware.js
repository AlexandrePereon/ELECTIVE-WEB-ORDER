export default async function isUserMiddleware(req, res, next) {
  const { role } = req.body.userData;

  if (role === 'user') {
    next();
  } else {
    res.status(403).send("Vous n'avez pas le rôle nécessaire pour accéder à cette ressource.");
  }
}
