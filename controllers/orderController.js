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
const { destroy } = require('../utils/cloudinary');

module.exports.fillCart = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { orderId } = req.params;
    const {
      latitude,
      longitude,
      address,
      distance,
      deliveryFee = 0,
    } = req.body;
    let totalPrice = deliveryFee;

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
        id: req.user.id,
      },
    });

    if (existPendingOrder)
      createError(
        'You already have an order in progress, please wait util the old order is delivered.',
      );

    await Order.update(
      {
        address,
        customerLatitude: latitude,
        customerLongitude: longitude,
        distance,
        deliveryFee,
      },
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

exports.getDeliveryPendingByRestaurant = async (req, res, next) => {
  try {
    const order = await Order.findAll({
      where: {
        status: 'DELIVERY_PENDING',
        restaurantId: req.user.id,
      },
      include: [
        {
          model: OrderMenu,
          include: {
            model: OrderMenuOptionGroup,
            include: OrderMenuOption,
          },
          include: {
            model: Menu,
            attributes: ['menuImage'],
          },
        },
        {
          model: Customer,
          attributes: ['firstName', 'lastName', 'phoneNumber'],
        },
        {
          model: Driver,
          attributes: ['firstName', 'lastName', 'phoneNumber'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    res.json({ order });
  } catch (err) {
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

exports.deleteMenu = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { menuId } = req.params;
    const menu = await Menu.findByPk(menuId);

    if (menu.restaurantId !== req.user.id) {
      createError('You are not the owner of this restaurant', 400);
    }

    if (!menu) {
      createError('Menu not found', 400);
    }

    const menuOptionGroups = await MenuOptionGroup.findAll({
      where: {
        menuId,
      },
    });

    const menuOptionGroupIds = JSON.parse(JSON.stringify(menuOptionGroups)).map(
      (el) => el.id,
    );

    const menuOptions = await MenuOption.findAll({
      where: {
        menuOptionGroupId: menuOptionGroupIds,
      },
      transaction: t,
    });

    const menuOptionsIds = JSON.parse(JSON.stringify(menuOptions)).map(
      (el) => el.id,
    );

    await MenuOption.update(
      { status: 'DEACTIVATED' },
      {
        where: {
          id: menuOptionsIds,
        },
        transaction: t,
      },
    );

    await MenuOptionGroup.update(
      { status: 'DEACTIVATED' },
      {
        where: {
          id: menuOptionGroupIds,
        },
        transaction: t,
      },
    );

    await Menu.update(
      { status: 'DEACTIVATED' },
      {
        where: {
          id: menuId,
        },
        transaction: t,
      },
    );

    await t.commit();
    res.sendStatus(204);
  } catch (err) {
    await t.rollback();
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
        attributes: [
          'firstName',
          'lastName',
          'driverImage',
          'phoneNumber',
          'id',
        ],
      },
    });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.editFoodPicture = async (req, res, next) => {
  try {
    const { menuId } = req.body;
    const menu = await Menu.findByPk(menuId);

    if (menu.restaurantId !== req.user.id) {
      createError('You are not the owner of this restaurant', 400);
    }

    if (!menu) {
      createError('Menu not found', 400);
    }

    if (req.imageFile && menu.menuImage) {
      const deletePreviousImage = await destroy(menu.menuImagePublicId);
    }

    if (req.imageFile) {
      menu.menuImagePublicId = req.imageFile.public_id;
      menu.menuImage = req.imageFile.secure_url;
    }

    await menu.save();

    res.json({ message: 'Update menu picture success.' });
  } catch (err) {
    next(err);
  }
};

exports.editFoodMenu = async (req, res, next) => {
  const { menuId, name, price } = req.body;
  const menu = await Menu.findByPk(menuId);

  if (menu.restaurantId !== req.user.id) {
    createError('You are not the owner of this restaurant', 400);
  }

  if (!menu) {
    createError('Menu not found', 400);
  }

  if (!name) {
    createError('foodname is required', 400);
  }

  if (!price) {
    createError('Price is required', 400);
  }

  await Menu.update({ name, price }, { where: { id: menuId } });

  res.json({ message: 'Update menu success.' });
};
