const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the client parameter in the callback.
wss.on('connection', (client) => {
  console.log('Client connected');

  // Send user count for each client
  wss.clients.forEach((client) => {
    client.send(wss.clients.size);
  });

  // Broadcast to all
  wss.broadcast = function broadcast(data) {

    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(data));
    });
  };

  // Generate unique ID and send back after changing message type (notification for username change, message for new message)
  client.on('message', (msg) => {

    const incoming = JSON.parse(msg);
    incoming.message.id = uuidV1();
    switch (incoming.message.type) {
      case 'postNotification':
        incoming.message.type = 'incomingNotification';
        break;
      case 'postMessage':
        incoming.message.type = 'incomingMessage';
        break;
    }
    wss.broadcast(incoming);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', () => {
    console.log('Client disconnected');

    // Update user count when client disconnects
    wss.clients.forEach((client) => {
      client.send(wss.clients.size);
    });
  });
});
