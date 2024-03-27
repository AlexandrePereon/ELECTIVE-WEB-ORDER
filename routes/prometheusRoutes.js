import client from 'prom-client';
import express from 'express';

const register = new client.Registry();
const prometheusRouter = express.Router();

client.collectDefaultMetrics({ register });

prometheusRouter.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default prometheusRouter;
