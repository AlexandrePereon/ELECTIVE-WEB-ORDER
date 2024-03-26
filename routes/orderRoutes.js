import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import isUserMiddleware from '../middlewares/isUserMiddleware.js';
import { orderController } from '../controllers/orderController.js';

const orderRouter = express.Router();

/**
 * @swagger
 * /order/create/:
 *   post:
 *     summary: Get an article by ID
 *     description: This endpoint retrieves an article by its unique identifier.
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               menus:
 *                 type: string
 *                 example: ['6602bc8fdbbe228cf99bc07f','6602bc8fdbbe228cf99bc07f']
 *               articles:
 *                 type: string
 *                 example: ['6602bc5bdbbe228cf99bc077','6602bc75dbbe228cf99bc07b']
 *               restaurantId:
 *                 type: string
 *                 example: '6602bc45dbbe228cf99bc073'
 *     responses:
 *       200:
 *         description: Successfully retrieved the article
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Article not found'
 *     security:
 *       - BearerAuth: []
 */
orderRouter.post('/create', authMiddleware, isUserMiddleware, orderController.create);

export default orderRouter;
