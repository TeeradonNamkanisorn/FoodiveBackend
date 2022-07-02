const { Server } = require('socket.io');
const io = new Server({
  cors: {
    origin: '*',
  },
});
const SOCKET_PORT = 4444;

io.on('connection', (socket) => {
  console.log('someone has connected');
});

io.listen(SOCKET_PORT);
console.log('success');
