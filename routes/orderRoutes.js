import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import isUserMiddleware from '../middlewares/isUserMiddleware.js';
import isRestaurantMiddleware from '../middlewares/isRestaurantMiddleware.js';
import hasRestaurantMiddleware from '../middlewares/hasRestaurantMiddleware.js';
import { orderController } from '../controllers/orderController.js';
import isdDeliverymanMiddleware from '../middlewares/isDeliverymanMiddleware.js';

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
 *   put:
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
orderRouter.put('/accept', authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, orderController.accept);

/**
 * @swagger
 * /order/prepared:
 *   put:
 *     summary: Mark an order as prepared
 *     description: This endpoint allows a restaurant to mark an order as prepared. It verifies that the order exists, checks if the order belongs to the restaurant making the request, and ensures the order is in the 'En préparation' state before updating its status to 'Préparée'.
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
 *                 description: The unique identifier of the order to be marked as prepared.
 *                 example: '5f2b5cdbe344c8bcbf22fcfa'
 *     responses:
 *       200:
 *         description: Order successfully marked as prepared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Commande préparée avec succès'
 *       400:
 *         description: Validation errors such as order not from this restaurant or order not in preparation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Cette commande n appartient pas à ce restaurant'
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
orderRouter.put('/prepared', authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, orderController.prepared);

/**
 * @swagger
 * /order/deliver:
 *   put:
 *     summary: Deliver an order
 *     description: This endpoint allows a deliveryman to mark an order as 'En Livraison'. It verifies the order exists, is marked as 'Préparée', and updates the status to 'En Livraison'.
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
 *                 description: The unique identifier of the order to be delivered.
 *                 example: '5f2b5cdbe344c8bcbf22fcfb'
 *     responses:
 *       200:
 *         description: Order is being delivered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Commande en cours de livraison'
 *       400:
 *         description: Validation errors such as order not prepared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'La commande n est pas préparée'
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
orderRouter.put('/deliver', authMiddleware, isdDeliverymanMiddleware, orderController.deliver);

/**
 * @swagger
 * /order/receive:
 *   put:
 *     summary: Mark an order as received
 *     description: This endpoint allows a client to mark an order as 'Livrée'. It verifies the order exists, belongs to the client making the request, and is in the 'En Livraison' state before updating its status to 'Livrée'.
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
 *                 description: The unique identifier of the order to be received.
 *                 example: '5f2b5cdbe344c8bcbf22fcfc'
 *     responses:
 *       200:
 *         description: Order successfully received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Commande livrée avec succès'
 *       400:
 *         description: Validation errors such as unauthorized action or order not in delivery
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Vous n êtes pas autorisé à effectuer cette action'
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
orderRouter.put('/receive', authMiddleware, isUserMiddleware, orderController.receive);

export default orderRouter;
