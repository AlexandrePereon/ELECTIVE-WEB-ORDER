import express from 'express';
import expressWs from 'express-ws';
import authSocketMiddleware from '../middlewares/authSocketMiddleware.js';
import isRestaurantSocketMiddleware from '../middlewares/isRestaurantSocketMiddleware.js';
import restaurantSocketController from '../controllers/restaurantController.js';
import hasRestaurantSocketMiddleware from '../middlewares/hasRestaurantSocketMiddleware.js';

const sockerServer = expressWs(express());
const { app } = sockerServer;

app.ws('/restaurant', authSocketMiddleware, isRestaurantSocketMiddleware, hasRestaurantSocketMiddleware, restaurantSocketController);

export default app;
