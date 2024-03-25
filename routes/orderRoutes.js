import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import orderController from '../controllers/orderController.js';
import restaurantMiddleware from '../middlewares/restaurantMiddleware.js';

const restaurantRouter = express.Router();

restaurantRouter.post('/create', authMiddleware, restaurantMiddleware, orderController.create);

export default restaurantRouter;
