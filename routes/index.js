import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

fs.readdirSync(__dirname).forEach(async (file) => {
  if (file in ['index.js', 'prometheusRoutes.js']) return;
  const route = await import(`./${file}`);
  router.use(route.default);
});

export default router;
