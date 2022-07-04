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

    if (cart.status !== 'IN_CART') {
      createError("The entity you're trying to edit is not a cart");
    }

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
      include: {
        model: OrderMenu,
        include: {
          model: OrderMenuOptionGroup,
          include: OrderMenuOption,
        },
      },
    });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
