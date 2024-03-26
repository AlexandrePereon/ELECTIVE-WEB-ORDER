import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import orderController from '../controllers/orderController.js';
import restaurantMiddleware from '../middlewares/restaurantMiddleware.js';

const restaurantRouter = express.Router();

/**
 * @swagger
 * /order/create/:
 *   post:
 *     summary: Get an article by ID
 *     description: This endpoint retrieves an article by its unique identifier.
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Successfully retrieved the article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
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
restaurantRouter.post('/create', orderController.create);

export default restaurantRouter;
