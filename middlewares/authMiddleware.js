// add the userHeader to the request body
export default async function authMiddleware(req, res, next) {
  let userData;

  if (req.headers['x-user']) {
    userData = JSON.parse(req.headers['x-user']);
  }

  if (userData) {
    req.body.userData = userData;
    next();
  } else {
    res.status(400).send('No user data provided');
  }
}
