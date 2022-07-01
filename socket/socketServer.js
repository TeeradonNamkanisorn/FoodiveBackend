const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: '*',
});
const SOCKET_PORT = 3050;

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.listen(SOCKET_PORT, () => {
  console.log('listening on http://localhost:' + SOCKET_PORT);
});
