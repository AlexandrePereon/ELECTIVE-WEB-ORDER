import express from 'express';
import expressWs from 'express-ws';
import authSocketMiddleware from '../middlewares/authSocketMiddleware.js';
import notificationSocketController from '../controllers/notificationController.js';

const sockerServer = expressWs(express());
const { app } = sockerServer;

app.ws('/notification', authSocketMiddleware, notificationSocketController);

export default app;
