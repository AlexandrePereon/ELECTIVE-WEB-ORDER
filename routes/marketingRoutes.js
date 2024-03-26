import express from 'express';
import expressWs from 'express-ws';
import orderSub from '../utils/orderSubscription.js';

const sockerServer = expressWs(express());
const { app } = sockerServer;

app.ws('/socket', (ws, req) => {
  ws.send('Welcome to the websocket server!');

  ws.on('message', (msg) => {
    ws.send(`Message received: ${msg}`);
  });

  const handleOrder = (data) => {
    // Envoyez les données mises à jour au client
    ws.send(JSON.stringify({ type: 'chiffreAffaireUpdate', data }));
  };

  orderSub.subscribe('commandePayee', handleOrder);

  ws.on('close', () => {
    ws.send('Connection closed');
    orderSub.unsubscribe('commandePayee', handleOrder);
  });
});

export default app;
