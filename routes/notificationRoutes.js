import express from 'express';
import expressWs from 'express-ws';
import authSocketMiddleware from '../middlewares/authSocketMiddleware.js';
import { notificationSocketController, notificationController } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const sockerServer = expressWs(express());
const notificationRouter = sockerServer.app;

notificationRouter.ws('/notification', authSocketMiddleware, notificationSocketController);

/**
 * @swagger
 * /api-order/notified:
 *   put:
 *     summary: Mark all notifications as seen
 *     description: This endpoint allows a user to mark all their notifications as seen. It updates the status of all notifications associated with the user to indicate they have been viewed.
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications successfully marked as seen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Notifications marquées comme lues'
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
notificationRouter.put('/notified', authMiddleware, notificationController.notified);

export default notificationRouter;
