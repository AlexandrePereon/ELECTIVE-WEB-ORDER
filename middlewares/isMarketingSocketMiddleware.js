export default async function isMarketingSocketMiddleware(ws, req, next) {
  const { role } = req.userData;

  if (role === 'marketing') {
    next();
  } else {
    ws.send('Vous n\'avez pas le rôle nécessaire pour accéder à cette ressource.');
    ws.close();
  }
}
