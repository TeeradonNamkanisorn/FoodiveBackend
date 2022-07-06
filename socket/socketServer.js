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

  console.log('new user');

  onlineUsers[role + 's'].push({
    ...userData,
    notifiedNearby: role === 'customer' ? false : undefined,
  });
}

function updateDriverPosition(userData) {
  const driver = onlineUsers.drivers.find((user) => user.id === userData.id);
  if (!driver) return;
  driver.latitude = userData.latitude;
  driver.longitude = userData.longitude;
  driver.status = userData.status;
  console.log('updating driver position');
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
  console.log('connect');
  socket.on('newUser', (data) => {
    addOnlineUser({ ...data.info, socketId: socket.id }, data.role);
    console.log(onlineUsers);
  });

  socket.on('updateDriverPosition', (userData) => {
    updateDriverPosition(userData);
  });

  socket.on('disconnect', () => {
    findAndDeleteUserFromSocketId(socket.id);
    console.log(onlineUsers);
  });

  socket.on('forceDisconnect', () => {
    findAndDeleteUserFromSocketId(socket.id);
    console.log('manual disconnect');
    console.log(onlineUsers);
    socket.disconnect();
  });

  socket.on(
    'restaurantAccept',
    ({ restaurantLatitude, restaurantLongitude }) => {
      console.log('restaurant accept');
      try {
        let availableDrivers = onlineUsers.drivers;
        availableDrivers = availableDrivers.filter((driver) => {
          return driver.latitude !== null;
        });

        console.log(availableDrivers);
        availableDrivers.filter((driver) => {
          const distance = getDistanceFromLatLonInKm(
            restaurantLatitude,
            restaurantLongitude,
            driver.latitude,
            driver.longitude,
          );
          return distance <= 10 && driver.status === 'AVAILABLE';
        });

        const socketIds = availableDrivers.map((driver) => driver.socketId);
        console.log(socketIds);
        for (let i = 0; i < socketIds.length; i++) {
          io.to(socketIds[i]).emit('notifyDriverOrder', {
            message: 'You may accept the upcoming order',
          });
        }
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
});

io.listen(SOCKET_PORT);
console.log('success');
