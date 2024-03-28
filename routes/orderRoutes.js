import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import isUserMiddleware from '../middlewares/isUserMiddleware.js';
import isRestaurantMiddleware from '../middlewares/isRestaurantMiddleware.js';
import hasRestaurantMiddleware from '../middlewares/hasRestaurantMiddleware.js';
import { orderController } from '../controllers/orderController.js';

const orderRouter = express.Router();

/**
 * @swagger
 * /order/create/:
 *   post:
 *     summary: Create a new order
 *     description: This endpoint allows the creation of a new order including specified menus and articles within a particular restaurant. It ensures that menus and articles are provided, validates the existence of the restaurant, checks if all items belong to the same restaurant, calculates the total price, and finally, creates and saves the new order.
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menus
 *               - articles
 *               - restaurantId
 *             properties:
 *               menus:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of menu IDs to include in the order.
 *                 example: ['6602bc8fdbbe228cf99bc07f', '6602bc8fdbbe228cf99bc07f']
 *               articles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of article IDs to include in the order.
 *                 example: ['6602bc5bdbbe228cf99bc077', '6602bc75dbbe228cf99bc07b']
 *               restaurantId:
 *                 type: string
 *                 description: The unique identifier of the restaurant for the order.
 *                 example: '6602bc45dbbe228cf99bc073'
 *     responses:
 *       200:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: string
 *                   description: The unique identifier of the created order.
 *                   example: '6612bc45dbbe228cf99bc078'
 *                 message:
 *                   type: string
 *                   example: 'Commande créée avec succès'
 *       400:
 *         description: Validation error such as no menus or articles provided, or items not from the same restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Menus ou articles non fournis'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Restaurant non trouvé'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Internal server error'
 */
orderRouter.post('/create', authMiddleware, isUserMiddleware, orderController.create);

/**
 * @swagger
 * /order/accept/:
 *   post:
 *     summary: Accept an order
 *     description: This endpoint allows a restaurant to accept an order by its ID. It verifies that the order exists, checks if the order belongs to the restaurant making the request, and ensures the order has not been previously accepted before updating its status.
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The unique identifier of the order to be accepted.
 *                 example: '6612bc45dbbe228cf99bc078'
 *     responses:
 *       200:
 *         description: Order successfully accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Commande acceptée avec succès'
 *       400:
 *         description: Validation errors such as order not from this restaurant or order already accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'La commande n est pas du même restaurant'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Commande non trouvée'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Internal server error'
 */
orderRouter.post('/accept', authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, orderController.accept);

export default orderRouter;
