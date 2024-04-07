import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import isUserMiddleware from '../middlewares/isUserMiddleware.js';
import isRestaurantMiddleware from '../middlewares/isRestaurantMiddleware.js';
import hasRestaurantMiddleware from '../middlewares/hasRestaurantMiddleware.js';
import orderController from '../controllers/orderController.js';
import isDeliverymanMiddleware from '../middlewares/isDeliverymanMiddleware.js';
import isUserOrHasRestaurantMiddleware from '../middlewares/isUserOrHasRestaurantMiddleware.js';

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
orderRouter.put('/deliver', authMiddleware, isDeliverymanMiddleware, orderController.deliver);

/**
 * @swagger
 * /order/delivered:
 *   put:
 *     summary: Mark an order as received
 *     description: This endpoint allows a deliveryman to mark an order as received. It verifies the order exists, is marked as 'En Livraison', and updates the status to 'Livrée'.
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
orderRouter.put('/delivered', authMiddleware, isDeliverymanMiddleware, orderController.delivered);

/**
 * @swagger
 * /order/waiting:
 *   get:
 *     summary: Retrieve waiting orders
 *     description: This endpoint allows a restaurant or a client to retrieve their waiting orders. If the user is a restaurant, it returns orders waiting in the restaurant. If the user is a client, it returns the client's waiting orders.
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Waiting orders successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '660fa7f629e4ad5a2180c6ba'
 *                       user_id:
 *                         type: integer
 *                         example: 4
 *                       restaurant_id:
 *                         type: string
 *                         example: '660e5a7aaf4d159011308c79'
 *                       date_ordered:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-04-05T07:27:50.903Z'
 *                       status:
 *                         type: string
 *                         example: 'Préparée'
 *                       menus:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             menu_name:
 *                               type: string
 *                               example: 'Menu ABC'
 *                             articles:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   article_name:
 *                                     type: string
 *                                     example: 'Article XYZ'
 *                                   _id:
 *                                     type: string
 *                                     example: '660fa7f629e4ad5a2180c6bc'
 *                             menu_price:
 *                               type: string
 *                               example: '25.99'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bb'
 *                       articles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             article_name:
 *                               type: string
 *                               example: 'Article XYZ'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bc'
 *                       total_price:
 *                         type: string
 *                         description: The total price of the order.
 *                         example: '25.99'
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
orderRouter.get('/waiting', authMiddleware, isUserOrHasRestaurantMiddleware, orderController.getWaitingOrders);

/**
 * @swagger
 * /order/active:
 *   get:
 *     summary: Retrieve active orders
 *     description: This endpoint allows a restaurant or a client to retrieve their active orders. Active orders include those in preparation, prepared, or currently being delivered. The orders returned depend on the role of the requester (restaurant or user).
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Active orders successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '660fa7f629e4ad5a2180c6ba'
 *                       user_id:
 *                         type: integer
 *                         example: 4
 *                       restaurant_id:
 *                         type: string
 *                         example: '660e5a7aaf4d159011308c79'
 *                       date_ordered:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-04-05T07:27:50.903Z'
 *                       status:
 *                         type: string
 *                         example: 'Préparée'
 *                       menus:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             menu_name:
 *                               type: string
 *                               example: 'Menu ABC'
 *                             articles:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   article_name:
 *                                     type: string
 *                                     example: 'Article XYZ'
 *                                   _id:
 *                                     type: string
 *                                     example: '660fa7f629e4ad5a2180c6bc'
 *                             menu_price:
 *                               type: string
 *                               example: '25.99'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bb'
 *                       articles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             article_name:
 *                               type: string
 *                               example: 'Article XYZ'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bc'
 *                       total_price:
 *                         type: string
 *                         description: The total price of the order.
 *                         example: '25.99'
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
orderRouter.get('/active', authMiddleware, isUserOrHasRestaurantMiddleware, orderController.getActiveOrders);

/**
 * @swagger
 * /order/inactive:
 *   get:
 *     summary: Retrieve inactive orders
 *     description: This endpoint allows a restaurant or a client to retrieve their inactive orders. Inactive orders include those that have been received or canceled. The orders returned depend on the role of the requester (restaurant or user).
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Inactive orders successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '660fa7f629e4ad5a2180c6ba'
 *                       user_id:
 *                         type: integer
 *                         example: 4
 *                       restaurant_id:
 *                         type: string
 *                         example: '660e5a7aaf4d159011308c79'
 *                       date_ordered:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-04-05T07:27:50.903Z'
 *                       status:
 *                         type: string
 *                         example: 'Préparée'
 *                       menus:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             menu_name:
 *                               type: string
 *                               example: 'Menu ABC'
 *                             articles:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   article_name:
 *                                     type: string
 *                                     example: 'Article XYZ'
 *                                   _id:
 *                                     type: string
 *                                     example: '660fa7f629e4ad5a2180c6bc'
 *                             menu_price:
 *                               type: string
 *                               example: '25.99'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bb'
 *                       articles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             article_name:
 *                               type: string
 *                               example: 'Article XYZ'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bc'
 *                       total_price:
 *                         type: string
 *                         description: The total price of the order.
 *                         example: '25.99'
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
orderRouter.get('/inactive', authMiddleware, isUserOrHasRestaurantMiddleware, orderController.getInactiveOrders);

/**
 * @swagger
 * /order/to-deliver:
 *   get:
 *     summary: Retrieve orders ready to deliver
 *     description: This endpoint allows a deliveryman to retrieve orders that are ready to be delivered. It returns orders with the status 'Préparée', sorted by the date they were ordered in descending order. Each order includes details such as menu items and total price.
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders ready to deliver successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '660fa7f629e4ad5a2180c6ba'
 *                       user_id:
 *                         type: integer
 *                         example: 4
 *                       restaurant_id:
 *                         type: string
 *                         example: '660e5a7aaf4d159011308c79'
 *                       date_ordered:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-04-05T07:27:50.903Z'
 *                       status:
 *                         type: string
 *                         example: 'Préparée'
 *                       menus:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             menu_name:
 *                               type: string
 *                               example: 'Menu ABC'
 *                             articles:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   article_name:
 *                                     type: string
 *                                     example: 'Article XYZ'
 *                                   _id:
 *                                     type: string
 *                                     example: '660fa7f629e4ad5a2180c6bc'
 *                             menu_price:
 *                               type: string
 *                               example: '25.99'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bb'
 *                       articles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             article_name:
 *                               type: string
 *                               example: 'Article XYZ'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bc'
 *                       total_price:
 *                         type: string
 *                         description: The total price of the order.
 *                         example: '25.99'
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
orderRouter.get('/to-deliver', authMiddleware, isDeliverymanMiddleware, orderController.getOrdersToDeliver);

/**
 * @swagger
 * /order/in-delivery:
 *   get:
 *     summary: Retrieve orders currently being delivered
 *     description: This endpoint allows a deliveryman to retrieve orders they are currently delivering. It returns orders with the status 'En Livraison', sorted by the date they were ordered in descending order.
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders in delivery successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '660fa7f629e4ad5a2180c6ba'
 *                       user_id:
 *                         type: integer
 *                         example: 4
 *                       restaurant_id:
 *                         type: string
 *                         example: '660e5a7aaf4d159011308c79'
 *                       date_ordered:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-04-05T07:27:50.903Z'
 *                       status:
 *                         type: string
 *                         example: 'Préparée'
 *                       menus:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             menu_name:
 *                               type: string
 *                               example: 'Menu ABC'
 *                             articles:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   article_name:
 *                                     type: string
 *                                     example: 'Article XYZ'
 *                                   _id:
 *                                     type: string
 *                                     example: '660fa7f629e4ad5a2180c6bc'
 *                             menu_price:
 *                               type: string
 *                               example: '25.99'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bb'
 *                       articles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             article_name:
 *                               type: string
 *                               example: 'Article XYZ'
 *                             _id:
 *                               type: string
 *                               example: '660fa7f629e4ad5a2180c6bc'
 *                       deliveryman_id:
 *                         type: integer
 *                         example: 8
 *                       total_price:
 *                         type: string
 *                         description: The total price of the order.
 *                         example: '25.99'
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
orderRouter.get('/in-delivery', authMiddleware, isDeliverymanMiddleware, orderController.getOrdersInDelivery);

export default orderRouter;
