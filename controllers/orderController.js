const createError = require('../services/createError');
const {
  sequelize,
  Customer,
  Order,
  Driver,
  OrderMenu,
  OrderMenuOptionGroup,
  OrderMenuOption,
  Menu,
  MenuOptionGroup,
  MenuOption,
} = require('../models');
const { Op } = require('sequelize');

module.exports.fillCart = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { orderId } = req.params;
    const { latitude, longitude, address } = req.body;
    let totalPrice = 0;

    let cart = await Order.findByPk(orderId, {
      include: {
        model: OrderMenu,
        include: [
          {
            model: Menu,
          },
          {
            model: OrderMenuOptionGroup,
            include: [
              {
                model: MenuOptionGroup,
              },
              {
                model: OrderMenuOption,
                include: MenuOption,
              },
            ],
          },
        ],
      },
      where: {
        status: 'IN_CART',
      },
      transaction: t,
    });

    const existPendingOrder = await Order.findOne({
      where: {
        status: {
          [Op.or]: ['DELIVERY_PENDING', 'DRIVER_PENDING', 'RESTAURANT_PENDING'],
        },
        restaurantId: cart.restaurantId,
      },
    });

    if (existPendingOrder)
      createError(
        'You already have an order in progress, please wait util the old order is delivered.',
      );

    await Order.update(
      { address, customerLatitude: latitude, customerLongitude: longitude },
      { where: { id: orderId }, transaction: t },
    );

    for (let orderMenu of cart.OrderMenus) {
      const newMenuPrice = orderMenu.Menu.price;
      const newMenuName = orderMenu.Menu.name;
      const menuId = orderMenu.Menu.id;
      totalPrice += newMenuPrice;
      await OrderMenu.update(
        { name: newMenuName, price: newMenuPrice },
        {
          where: {
            menuId,
          },
          transaction: t,
        },
      );
      for (let orderMenuOptionGroup of orderMenu.OrderMenuOptionGroups) {
        const newGroupName = orderMenuOptionGroup.MenuOptionGroup.name;
        const groupId = orderMenuOptionGroup.MenuOptionGroup.id;
        await OrderMenuOptionGroup.update(
          { name: newGroupName },
          { where: { menuOptionGroupId: groupId }, transaction: t },
        );

        for (let orderMenuOption of orderMenuOptionGroup.OrderMenuOptions) {
          const newOptionName = orderMenuOption.MenuOption.name;
          const newOptionPrice = orderMenuOption.MenuOption.price;
          const optionId = orderMenuOption.MenuOption.id;
          totalPrice += newOptionPrice;
          await OrderMenuOption.update(
            { name: newOptionName, price: newOptionPrice },
            {
              where: {
                menuOptionId: optionId,
              },
              transaction: t,
            },
          );
        }
      }
    }

    await Order.update(
      {
        price: totalPrice,
        status: 'RESTAURANT_PENDING',
        address,
        customerLatitude: latitude,
        customerLongitude: longitude,
        addressName: address,
      },
      { where: { id: orderId }, transaction: t },
    );

    cart = await Order.findByPk(orderId, {
      include: {
        model: OrderMenu,
        include: [
          {
            model: OrderMenuOptionGroup,
            include: [
              {
                model: OrderMenuOption,
              },
            ],
          },
        ],
      },
      transaction: t,
    });

    res.json({ cart });

    await t.commit();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.restaurantGetPendingOrders = async (req, res, next) => {
  try {
    const order = await Order.findAll({
      where: {
        status: 'RESTAURANT_PENDING',
        restaurantId: req.user.id,
      },
      include: [
        {
          model: OrderMenu,
          include: {
            model: OrderMenuOptionGroup,
            include: OrderMenuOption,
          },
        },
        {
          model: Customer,
          attributes: ['firstName', 'lastName', 'phoneNumber'],
        },
      ],
    });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.restaurantUpdateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(orderId);

    if (order.restaurantId !== req.user.id) {
      createError('You are not the owner of this restaurant');
    }

    await Order.update({ status }, { where: { id: orderId } });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.customerGetCurrentPendingOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        status: 'DELIVERY_PENDING',
        customerId: req.user.id,
      },
      include: {
        model: Driver,
        attributes: ['firstName', 'lastName', 'driverImage', 'phoneNumber'],
      },
    });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
