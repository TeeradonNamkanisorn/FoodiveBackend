const { Menu, MenuOption, MenuOptionGroup } = require('../models');
exports.calculatePriceFromMenuList = async (menus, restaurantId) => {
  const optionPrices = await menuList(restaurantId);
  const menuPrices = await menuOption(restaurantId);

  console.log(optionPrices, menuPrices);

  let totalPrice;

  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    totalPrice += menuPrices[menu.id];

    for (let j = 0; j < menus.menuOptions.length; j++) {
      const menuOption = menus[i].menuOptions[j];
      totalPrice += menus[i].menuOptions[j].price;
    }
  }
  return totalPrice;
};

exports.getCartMenuArrayWithoutOptions = async (menus) => {
  return menus.map((menu) => ({
    name: menu.name,
    price: menu.price,
    comment: menu.comment,
  }));
};

//Finding a key-value in an object is better than finding an index in an array.
const menuList = async () => {
  let menus = await Menu.findAll({});
  menus = JSON.parse(JSON.stringify(menus));
  const menusObj = {};
  // menus: [{id, price, name}]
  // { id: {id, price, name}}
  for (let menu of menus) {
    menusObj[menu.id] = menu;
  }
  return menusObj;
};

const optionList = async () => {
  let options = await MenuOption.findAll({});
  options = JSON.parse(JSON.stringify(options));
  const optionsObj = {};
  for (let option of options) {
    optionsObj[option.id] = option;
  }
  return optionsObj;
};

const optionGroupList = async () => {
  let menuOptionGroups = await MenuOptionGroup.findAll({});
  menuOptionGroups = JSON.parse(JSON.stringify(menuOptionGroups));

  const menuOptionGroupsObj = {};
  for (let menuOptionGroup of menuOptionGroups) {
    menuOptionGroupsObj[menuOptionGroup.id] = menuOptionGroup;
  }

  return menuOptionGroupsObj;
};

const getFullMenuObj = async (restaurantId) => {
  const restaurantMenus = await Menu.findAll({
    where: { restaurantId },
    include: { model: MenuOptionGroup, include: MenuOption },
  });
  const restaurantMenuObj = {};
  JSON.parse(JSON.stringify(restaurantMenus)).forEach((men) => {
    const optionGroups = {};

    men.MenuOptionGroups.forEach((opGroup) => {
      const options = {};
      opGroup.MenuOptions.forEach((op) => {
        options[op.id] = op;
      });
      optionGroups[opGroup.id] = { ...opGroup, options };
    });

    restaurantMenuObj[men.id] = { ...men, optionGroups };
  });

  return restaurantMenuObj;
};

//{
//     "cart": {
//         "id": 3,
//         "price": null,
//         "deliveryFee": 0,
//         "distance": null,
//         "status": "IN_CART",
//         "customerLatitude": null,
//         "customerLongitude": null,
//         "createdAt": "2022-06-27T07:14:22.000Z",
//         "updatedAt": "2022-06-27T07:14:22.000Z",
//         "customerId": 1,
//         "orderId": null,
//         "driverId": null,
//         "restaurantId": 1,
//         "OrderMenus": [
//             {
//                 "id": 3,
//                 "price": null,
//                 "name": null,
//                 "comment": null,
//                 "createdAt": "2022-06-27T07:14:22.000Z",
//                 "updatedAt": "2022-06-27T07:14:22.000Z",
//                 "menuId": 1,
//                 "orderId": 3,
//                 "OrderMenuOptionGroups": [
//                     {
//                         "id": 1,
//                         "orderMenuId": 3,
//                         "createdAt": "2022-06-27T07:14:22.000Z",
//                         "updatedAt": "2022-06-27T07:14:22.000Z",
//                         "menuOptionGroupId": 1,
//                         "OrderMenuOptions": [
//                             {
//                                 "id": 1,
//                                 "createdAt": "2022-06-27T07:14:22.000Z",
//                                 "updatedAt": "2022-06-27T07:14:22.000Z",
//                                 "menuOptionId": 1,
//                                 "orderMenuOptionGroupId": 1
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "id": 8,
//                 "price": null,
//                 "name": null,
//                 "comment": "no sauce",
//                 "createdAt": "2022-06-27T07:33:28.000Z",
//                 "updatedAt": "2022-06-27T07:33:28.000Z",
//                 "menuId": 2,
//                 "orderId": 3,
//                 "OrderMenuOptionGroups": []
//             },
//             {
//                 "id": 9,
//                 "price": null,
//                 "name": null,
//                 "comment": "no sauce",
//                 "createdAt": "2022-06-27T07:34:32.000Z",
//                 "updatedAt": "2022-06-27T07:34:32.000Z",
//                 "menuId": 2,
//                 "orderId": 3,
//                 "OrderMenuOptionGroups": [
//                     {
//                         "id": 13,
//                         "orderMenuId": 9,
//                         "createdAt": "2022-06-27T11:40:57.000Z",
//                         "updatedAt": "2022-06-27T11:40:57.000Z",
//                         "menuOptionGroupId": 3,
//                         "OrderMenuOptions": [
//                             {
//                                 "id": 11,
//                                 "createdAt": "2022-06-27T11:40:57.000Z",
//                                 "updatedAt": "2022-06-27T11:40:57.000Z",
//                                 "menuOptionId": 8,
//                                 "orderMenuOptionGroupId": 13
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// }

const getFullCart = async ({ OrderMenus }, restaurantId) => {
  const allMenuList = await menuList();
  const allMenuOptionGroups = await optionGroupList();
  const allMenuOptions = await optionList();
  let totalPrice = 0;

  const full = OrderMenus.map((menuIdItem) => {
    totalPrice += +allMenuList[menuIdItem.menuId].price;
    return {
      name: allMenuList[menuIdItem.menuId].name,
      image: allMenuList[menuIdItem.menuId].menuImage,
      price: allMenuList[menuIdItem.menuId].price,
      menuId: allMenuList[menuIdItem.menuId].id,
      id: menuIdItem.id,
      OrderMenuOptionGroups: menuIdItem.OrderMenuOptionGroups.map(
        (optionGroup) => {
          return {
            name: allMenuOptionGroups[optionGroup.menuOptionGroupId].name,
            id: optionGroup.id,
            menuOptionGroupId:
              allMenuOptionGroups[optionGroup.menuOptionGroupId].id,
            options: optionGroup.OrderMenuOptions.map((option) => {
              totalPrice += +allMenuOptions[option.menuOptionId].price;
              return {
                name: allMenuOptions[option.menuOptionId].name,
                price: allMenuOptions[option.menuOptionId].price,
                menuOptionId: allMenuOptions[option.menuOptionId].id,
                id: option.id,
              };
            }),
          };
        },
      ),
    };
  });

  return { cart: full, totalPrice };
};

module.exports = { getFullCart, getFullMenuObj };
