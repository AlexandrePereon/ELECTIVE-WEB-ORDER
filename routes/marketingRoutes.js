import express from 'express';
import expressWs from 'express-ws';
import authSocketMiddleware from '../middlewares/authSocketMiddleware.js';
import isMarketingSocketMiddleware from '../middlewares/isMarketingSocketMiddleware.js';
import marketingSocketController from '../controllers/marketingController.js';

const sockerServer = expressWs(express());
const { app } = sockerServer;

app.ws('/marketing', authSocketMiddleware, isMarketingSocketMiddleware, marketingSocketController);

export default app;
