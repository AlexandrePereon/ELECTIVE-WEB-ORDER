// add the userHeader to the request body
export default async function authMiddleware(req, res, next) {
  let userData;

  if (process.env.NODE_ENV_PROFILE === 'local') {
    userData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'SecurePassword123!',
      role: 'user',
    };
  } else if (req.headers['x-user']) {
    userData = JSON.parse(req.headers['x-user']);
  }

  if (userData) {
    req.body.userData = userData;
    next();
  } else {
    res.status(400).send('No user data provided');
  }
}
