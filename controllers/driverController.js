const createError = require('../services/createError');
const { destroy } = require('../utils/cloudinary');
const {
  Driver,
  Order,
  Restaurant,
  sequelize,
  Customer,
  OrderMenu,
  Menu,
} = require('../models');
const { Op, where, QueryTypes } = require('sequelize');
const getDistanceFromLatLonInKm = require('../services/calcDistance');
const clearFolder = require('../services/clearFolder');

exports.getMe = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.user.id);
    const { firstName, lastName } = req.body;

    if (!driver) {
      createError('You are unauthorize.', 400);
    }

    if (!firstName && !lastName && !req.imageFile) {
      createError('You cannot update empty data', 400);
    }

    if (firstName) {
      driver.firstName = firstName;
    }

    if (lastName) {
      driver.lastName = lastName;
    }

    if (req.imageFile && driver.driverImage) {
      const deleteRes = await destroy(driver.driverImagePublicId);
      console.log(deleteRes);
    }

    if (req.imageFile) {
      driver.driverImagePublicId = req.imageFile.public_id;
      driver.driverImage = req.imageFile.secure_url;
    }

    await driver.save();

    res.json({ message: 'Update profile success.' });
  } catch (err) {
    next(err);
  } finally {
    clearFolder('./public/images');
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.user.id);
    const { status } = req.body;

    console.log('statue', status);

    if (!driver) {
      createError('You are unauthorize.', 400);
    }

    if (
      status !== 'UNAVAILABLE' &&
      status !== 'AVAILABLE' &&
      status !== 'BUSY'
    ) {
      createError("Status must be 'AVAILABLE' or 'UNAVAILABLE' or 'BUSY'", 400);
    }

    if (driver.status === status) {
      createError('You cannot update same status as your current status', 400);
    }

    if (status) {
      driver.status = status;
    }

    await driver.save();

    res.json({ message: 'Update status success' });
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const { id } = req.user;
    //current latitude and longitude
    const { latitude, longitude } = req.body;
    if (latitude == null || latitude == null) {
      createError('latitude and longitude are required', 400);
    }

    await Driver.update({ latitude, longitude }, { where: { id } });

    res.json({ message: 'successfully recorded position' });
  } catch (err) {
    next(err);
  }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { id } = req.params;
    if (!id) {
      createError('order id are required', 400);
    }
    await Order.update({ driverId }, { where: { id } });

    res.json({ message: `orderId : ${id} accepted by driverId : ${driverId}` });
  } catch (err) {
    next(err);
  }
};

exports.searchOrder = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    let order = await Order.findAll({
      where: {
        status: 'DRIVER_PENDING',
        driverId: null,
      },
      include: [
        {
          model: Restaurant,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: OrderMenu,
        },
      ],
    });
    parseorder = JSON.parse(JSON.stringify(order));
    let orderArr = [];
    parseorder.forEach((element) => {
      getDistanceFromLatLonInKm(
        latitude,
        longitude,
        element.Restaurant.latitude,
        element.Restaurant.longitude,
      ) <= 20
        ? orderArr.push(element)
        : '';
    });

    res.json({ order: orderArr });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (order.status === 'IN_CART')
      createError('You cannot view this resource', 400);

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetailById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: {
        id: orderId,
      },
      include: [
        {
          model: Restaurant,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: OrderMenu,
          include: [
            {
              model: Menu,
            },
          ],
        },
      ],
    });

    if (order.status === 'IN_CART')
      createError('You cannot view this resource', 400);

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.getIncome = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.body;
    let order = await Order.findAll({
      where: {
        status: 'DELIVERED',
        driverId: id,
      },
      attributes: [
        [sequelize.fn('sum', sequelize.col('deliveryFee')), 'totalDeliveryFee'],
      ],
    });

    res.json({ income: order });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deliveringStatus = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { id } = req.params;
    if (!id) {
      createError('order id are required', 400);
    }
    await Order.update(
      { status: 'DELIVERY_PENDING', driverId },
      { where: { id } },
    );

    res.json({
      message: `orderId : ${id} status : ${'DELIVERY_PENDING'} by driverId : ${driverId}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.deliveredStatus = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { id } = req.params;
    if (!id) {
      createError('order id are required', 400);
    }
    await Order.update({ status: 'DELIVERED' }, { where: { id } });

    res.json({
      message: `orderId : ${id} status : ${'DELIVERED'} by driverId : ${driverId}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.getDeliveryFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      createError('order id are required', 400);
    }
    let order = await Order.findOne({
      where: {
        id,
      },
      attributes: ['deliveryFee'],
    });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        driverId: req.user.id,
        status: 'DELIVERY_PENDING',
      },
      include: {
        model: Customer,
        attributes: ['firstName', 'lastName', 'phoneNumber', 'profileImage'],
      },
    });

    console.log(req.user.id);

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
