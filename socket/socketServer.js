const { Server } = require('socket.io');
const getDistanceFromLatLonInKm = require('../services/calcDistance');
const { Restaurant, Driver } = require('../models');
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

  onlineUsers[role + 's'].push({
    ...userData,
    notifiedNearby: role === 'customer' ? false : undefined,
  });
}

function updateDriverPosition(userData) {
  const driver = onlineUsers.drivers.find((user) => user.id === userData.id);
  if (!driver) return;
  console.log(userData);
  driver.latitude = userData.latitude;
  driver.longitude = userData.longitude;
  driver.status = userData.status;
}

const findAndDeleteUserFromSocketId = (socketId) => {
  for (key of Object.keys(onlineUsers)) {
    const userList = onlineUsers[key];
    const idx = userList.findIndex((user) => {
      return user.socketId === socketId;
    });

    if (idx !== -1) {
      const spliced = onlineUsers[key].splice(idx, 1);
    }
  }
};

const findRestaurantSocketId = (restaurantId) => {
  const restaurants = onlineUsers['restaurants'];
  return restaurants.find((res) => res.id === restaurantId)?.socketId;
};

io.on('connection', (socket) => {
  socket.on('newUser', (data) => {
    addOnlineUser({ ...data.info, socketId: socket.id }, data.role);
    // console.log(onlineUsers);
  });

  socket.on('updateDriverPosition', (userData) => {
    updateDriverPosition(userData);
  });

  socket.on('disconnect', () => {
    findAndDeleteUserFromSocketId(socket.id);
  });

  socket.on('forceDisconnect', () => {
    findAndDeleteUserFromSocketId(socket.id);

    socket.disconnect();
  });

  socket.on(
    'restaurantAccept',
    ({ restaurantLatitude, restaurantLongitude }) => {
      try {
        let availableDrivers = onlineUsers.drivers;
        availableDrivers = availableDrivers.filter((driver) => {
          return driver.latitude !== null;
        });

        console.log(availableDrivers);

        availableDrivers.filter((driver) => {
          const distance = getDistanceFromLatLonInKm(
            +restaurantLatitude,
            +restaurantLongitude,
            +driver.latitude,
            +driver.longitude,
          );
          console.log(distance, driver.status);

          return distance <= 10 && driver.status === 'AVAILABLE';
        });

        const socketIds = availableDrivers.map((driver) => driver.socketId);
        for (let i = 0; i < socketIds.length; i++) {
          io.to(socketIds[i]).emit('notifyDriverOrder', {
            message: 'You may accept the upcoming order',
          });
        }
        console.log(socketIds);
      } catch (err) {
        console.log(err.message);
        io.to(socket.id).emit('error', { message: err.message });
      }
    },
  );

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

  socket.on('driverAcceptOrder', ({ restaurantId }) => {
    console.log('driver accepted');
    console.log(restaurantId);
    const restaurantSocketId = findRestaurantSocketId(restaurantId);
    io.to(restaurantSocketId).emit('notifyAcceptOrder', {
      message: 'A driver has accepted an order',
    });
  });
});

io.listen(SOCKET_PORT);
console.log('success');
