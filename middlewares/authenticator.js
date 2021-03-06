const jwt = require('jsonwebtoken');
const createError = require('../services/createError');
const { Restaurant, Customer, Driver } = require('../models');

module.exports = (role) => async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer')) {
      createError('You are unauthorized', 401);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      createError('You are unauthorized', 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (payload.role !== role) createError('Invalid role', 401);

    let user;
    if (payload.role === 'restaurant') {
      user = await Restaurant.findOne({
        where: {
          email: payload.email,
        },
        attributes: { exclude: ['password'] },
      });
    } else if (payload.role === 'customer') {
      user = await Customer.findOne({
        where: {
          email: payload.email,
        },
        attributes: { exclude: ['password'] },
      });
    } else if (payload.role === 'driver') {
      user = await Driver.findOne({
        where: {
          email: payload.email,
        },
        attributes: { exclude: ['password'] },
      });
    } else {
      createError('You are unauthorized', 401);
    }

    if (!user) createError('You are unauthorized', 401);

    user = { ...JSON.parse(JSON.stringify(user)), role: payload.role };

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
