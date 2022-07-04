const { Server } = require('socket.io');
const io = new Server({
  cors: {
    origin: '*',
  },
});
const SOCKET_PORT = 4444;

const validRoles = ['customer', 'driver', 'restaurant'];
const onlineUsers = {
  customers: [],
  drivers: [],
  restaurants: [],
};

function addOnlineUser(userData, role) {
  if (!validRoles.includes(role)) {
    return;
  }

  const existUser = onlineUsers[role + 's'].find(
    (user) => user.id === userData.id,
  );
  if (existUser) return;

  onlineUsers[role + 's'].push(userData);
}

const findAndDeleteUserFromSocketId = (socketId) => {
  for (key of Object.keys(onlineUsers)) {
    const userList = onlineUsers[key];
    const idx = userList.findIndex((user) => {
      return user.socketId === socketId;
    });

    if (idx !== -1) {
      const splieced = onlineUsers[key].splice(idx, 1);
      console.log('spliced index: ', splieced);
    }
  }
};

const findRestaurantSocketId = (restaurantId) => {
  const restaurants = onlineUsers['restaurants'];
  return restaurants.find((res) => res.id === restaurantId)?.socketId;
};

io.on('connection', (socket) => {
  console.log('connect');
  socket.on('newUser', (data) => {
    addOnlineUser({ ...data.info, socketId: socket.id }, data.role);
    console.log(onlineUsers);
  });

  socket.on('disconnect', () => {
    findAndDeleteUserFromSocketId(socket.id);
    console.log(onlineUsers);
  });

  socket.on('notifyRestaurant', (payload) => {
    try {
      const restaurantSocketId = findRestaurantSocketId(payload.restaurantId);
      io.to(restaurantSocketId).emit('restaurantReceiveOrder', {
        message: 'You have one order incoming',
      });
    } catch (err) {
      io.to(socket.id).emit('error', { message: err.message });
    }
  });
});

io.listen(SOCKET_PORT);
console.log('success');
