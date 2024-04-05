// add the userHeader to the request body
export default async function authSocketMiddleware(ws, req, next) {
  let userData;

  if (req.headers['x-user']) {
    userData = JSON.parse(req.headers['x-user']);
  }

  if (userData) {
    req.userData = userData;
    next();
  } else {
    ws.send('No user data provided');
    ws.close();
  }
}
