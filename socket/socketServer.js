const { Server } = require('socket.io');
const io = new Server({
  cors: {
    origin: '*',
  },
});
const SOCKET_PORT = 3050;

io.on('connection', (socket) => {
  console.log(socket);
});

io.listen(SOCKET_PORT);
console.log('success');
