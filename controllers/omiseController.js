const omise = require('../utils/omise');
const createError = require('../services/createError');
const {
  sequelize,
  Order,
  OrderMenu,
  OrderMenuOptionGroup,
  OrderMenuOption,
  Menu,
  MenuOptionGroup,
  MenuOption,
} = require('../models');

exports.chargeCustomer = async (req, res, next) => {
  try {
    const { omiseToken } = req.body;
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    console.log(omiseToken);
    if (order.status !== 'IN_CART') createError('This is not a cart', 400);
    if (order.customerId !== req.user.id) createError('Forbidden', 403);

    const sum = req.body.totalInBaht;
    const customer = await omise.customers.create({
      email: req.user.email,
      card: omiseToken,
      description: req.user.email + ' ' + new Date(),
    });

    const charge = await omise.charges.create({
      amount: sum * 100,
      currency: 'thb',
      customer: customer.id,
    });

    console.log('chargeId: ', charge.id);

    next();
  } catch (err) {
    next(err);
  }
};
