import express from 'express';
import expressWs from 'express-ws';
import orderSub from '../utils/orderSubscription.js';
import { handleOrderFactory } from '../controllers/orderController.js';

const sockerServer = expressWs(express());
const { app } = sockerServer;

app.ws('/socket', (ws, req) => {
  console.log('body', req.body);
  console.log('headers', req.headers);
  ws.send('Welcome to the websocket server!');

  ws.on('message', (msg) => {
    ws.send(`Message received: ${msg}`);
  });

  orderSub.subscribe('commandePayee', handleOrderFactory(ws));

  ws.on('close', () => {
    ws.send('Connection closed');
    orderSub.unsubscribe('commandePayee', handleOrderFactory(ws));
  });
});

export default app;
