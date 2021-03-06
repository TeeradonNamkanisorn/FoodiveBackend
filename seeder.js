const {
  Tag,
  Customer,
  Restaurant,
  Driver,
  Menu,
  MenuOption,
  MenuOptionGroup,
  sequelize,
  MenuTag,
  Category,
  Order,
  OrderMenu,
  OrderMenuOption,
  OrderMenuOptionGroup,
} = require('./models');

const order = [
  // {
  //   price: 22,
  //   deliveryFee: 10,
  //   distance: 10,
  //   status: 'DELIVERY_PENDING',
  //   customerLatitude: '13.734879475073363',
  //   customerLongitude: '100.52830535401003',
  //   addressName: 'home',
  //   customerId: 1,
  //   driverId: 1,
  //   restaurantId: 1,
  // },
  // {
  //   price: null,
  //   deliveryFee: 10,
  //   distance: 10,
  //   status: 'IN_CART',
  //   customerLatitude: null,
  //   customerLongitude: null,
  //   addressName: 'home',
  //   customerId: 2,
  //   driverId: 2,
  //   restaurantId: 2,
  // },
  // {
  //   price: 302,
  //   deliveryFee: 33,
  //   distance: 10,
  //   status: 'DRIVER_PENDING',
  //   customerLatitude: '13.734879475073363',
  //   customerLongitude: '100.52830535401003',
  //   addressName: 'home',
  //   customerId: 1,
  //   driverId: 2,
  //   restaurantId: 2,
  // },
  // {
  //   price: 156,
  //   deliveryFee: 26,
  //   distance: 10,
  //   status: 'DELIVERED',
  //   customerLatitude: '13.734879475073363',
  //   customerLongitude: '100.52830535401003',
  //   addressName: 'home',
  //   customerId: 3,
  //   driverId: 1,
  //   restaurantId: 1,
  // },
  // {
  //   price: 220,
  //   deliveryFee: 60,
  //   distance: 10,
  //   status: 'RESTAURANT_PENDING',
  //   customerLatitude: '13.734879475073363',
  //   customerLongitude: '100.52830535401003',
  //   addressName: 'home',
  //   customerId: 4,
  //   driverId: 1,
  //   restaurantId: 1,
  // },
  // {
  //   price: 430,
  //   deliveryFee: 43,
  //   distance: 10,
  //   status: 'RESTAURANT_PENDING',
  //   customerLatitude: '13.734879475073363',
  //   customerLongitude: '100.52830535401003',
  //   addressName: 'home',
  //   customerId: 3,
  //   driverId: 2,
  //   restaurantId: 3,
  // },
  // {
  //   price: 423,
  //   deliveryFee: '30',
  //   distance: '10',
  //   status: 'DRIVER_PENDING',
  //   customerLatitude: '13.76203556569543',
  //   customerLongitude: '300',
  //   addressName: 'home',
  //   customerId: '2',
  //   driverId: '2',
  //   restaurantId: '2',
  // },
  // {
  //   price: '332',
  //   deliveryFee: '10',
  //   distance: '10',
  //   status: 'DELIVERY_PENDING',
  //   customerLatitude: '13.76203556569543',
  //   customerLongitude: '300',
  //   addressName: 'home',
  //   customerId: '2',
  //   driverId: '2',
  //   restaurantId: '2',
  // },
  // {
  //   price: '332',
  //   deliveryFee: '22',
  //   distance: '10',
  //   status: 'DELIVERED',
  //   customerLatitude: '13.76203556569543',
  //   customerLongitude: '300',
  //   addressName: 'home',
  //   customerId: '2',
  //   driverId: '1',
  //   restaurantId: '2',
  // },
];

const orderMenu = [
  // {
  //   price: 22,
  //   name: 'pad thai',
  //   comment: 'comment pad thai',
  //   orderId: 1,
  //   menuId: 1,
  // },
  // {
  //   price: 32,
  //   name: 'thai green curry',
  //   comment: 'comment thai green curry',
  //   orderId: 1,
  //   menuId: 3,
  // },
  // {
  //   comment: 'comment croissant',
  //   orderId: 2,
  //   menuId: 4,
  // },
  // {
  //   comment: 'comment Andre',
  //   orderId: 2,
  //   menuId: 5,
  // },
  // {
  //   price: 22,
  //   name: 'pad thai',
  //   comment: 'comment pad thai',
  //   orderId: 5,
  //   menuId: 1,
  // },
  // {
  //   price: 32,
  //   name: 'thai green curry',
  //   comment: 'comment thai green curry',
  //   orderId: 5,
  //   menuId: 3,
  // },
  // {
  //   price: 22,
  //   name: 'pad thai',
  //   comment: 'comment pad thai',
  //   orderId: 6,
  //   menuId: 1,
  // },
  // {
  //   price: 32,
  //   name: 'thai green curry',
  //   comment: 'comment thai green curry',
  //   orderId: 6,
  //   menuId: 3,
  // },
  // {
  //   price: 32,
  //   name: 'thai green curry',
  //   comment: 'comment thai green curry',
  //   orderId: 7,
  //   menuId: 3,
  // },
];

const orderMenuOptionGroup = [
  // {
  //   orderMenuId: 1,
  //   menuOptionGroupId: 1,
  // },
  // {
  //   orderMenuId: 3,
  //   menuOptionGroupId: 2,
  // },
];

const orderMenuOption = [
  // {
  //   orderMenuOptionGroupId: 1,
  //   menuOptionId: 1,
  // },
  // {
  //   orderMenuOptionGroupId: '1',
  //   menuOptionId: '2',
  // },
  // {
  //   orderMenuOptionGroupId: 2,
  //   menuOptionId: 4,
  // },
  // {
  //   orderMenuOptionGroupId: '2',
  //   menuOptionId: '5',
  // },
];

const foodTags = [
  'sweet',
  'salt',
  'spice',
  'european',
  'asian',
  'chinese',
  'sour',
  'cereal',
  'milk',
  'daily-product',
  'vegetable',
  'wine',
  'fruit',
];

//password: 111111
const customers = [
  {
    email: 'theme.2541@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'theme',
    lastName: 'namkanisorn',
    phoneNumber: '0922798232',
    profileImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png',
    profileImagePublicId: 'none',
  },
  {
    email: 'johnDoe@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'john',
    lastName: 'doe',
    phoneNumber: '0922798233',
    profileImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/800px-SNice.svg.png',
    profileImagePublicId: 'none',
  },
  {
    email: 'bob@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'TN',
    lastName: 'bob',
    phoneNumber: '0922798234',
    profileImage: 'https://miro.medium.com/max/460/0*9HT1OYr0CFqjBDNT.',
    profileImagePublicId: 'none',
  },
  {
    email: 'cat@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'cat',
    lastName: 'catty',
    phoneNumber: '0922798235',
    profileImage:
      'https://magnifiedtech.com/wp-content/uploads/2022/02/What-Android-App-Has-a-Smiley-Face-Notification-1.webp',
    profileImagePublicId: 'none',
  },
];

const drivers = [
  {
    email: 'themeDriver2541@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'ThemeDriver',
    lastName: 'Driver',
    phoneNumber: '0922998800',
    latitude: 13.744573458078486,
    longitude: 100.52333650466416,
    driverImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJMcbhvP9CrmDfXODm6xhHl-OUTVVIdzRaCA&usqp=CAU',
    driverImagePublicId: 'none',
  },
  {
    email: 'Doggy@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'DoggyDriver',
    lastName: 'Driverrr',
    phoneNumber: '0822998039',
    latitude: 13.744573458078486,
    longitude: 100.52333650466416,
    driverImage: 'https://images.emojiterra.com/twitter/512px/1f92e.png',
  },
  {
    email: 'Fox@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    firstName: 'foxy',
    lastName: 'squishy',
    phoneNumber: '0918009999',
    latitude: 13.744573458078486,
    longitude: 100.52333650466416,
  },
];

const restaurants = [
  {
    email: 'siamRestaurant@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    name: 'Jeh O Chula',
    phoneNumber: '0822225555',
    latitude: 13.742559513107528,
    longitude: 100.52253269980905,
    image:
      'https://a.cdn-hotels.com/gdcs/production1/d32/f93e1d15-b49b-4699-8904-06f8074f0f35.jpg',
    imagePublicId: 'none',
  },
  {
    email: 'frenchRestaurant@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    name: 'James Boulangerie',
    phoneNumber: '0822224444',
    latitude: 13.753253317880345,
    longitude: 100.43550537963817,
    image:
      'https://cdn.vox-cdn.com/thumbor/EKrsctH4FQDbuUKic89L3tiWULc=/0x0:1700x960/1200x800/filters:focal(714x344:986x616)/cdn.vox-cdn.com/uploads/chorus_image/image/69525497/restaurant_01_6b56e1a4.0.jpg',
    imagePublicId: 'none',
  },
  {
    email: 'chineseRestaurant@gmail.com',
    password: '$2a$10$6VVLjzxhP7r9OtL7FpG/Auhn6PYwyoOeULtZLZGnW..qYqE8WmcZa',
    name: 'Chinese Restaurant',
    phoneNumber: '0822224444',
    latitude: 13.74908,
    longitude: 100.523787,
    image:
      'https://media-cdn.tripadvisor.com/media/photo-s/07/06/10/f7/ming-palace-chinese-restaurant.jpg',
    imagePublicId: 'none',
  },
];

const menus = [
  {
    name: 'pad thai',
    price: 22,
    menuImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Phat_Thai_kung_Chang_Khien_street_stall.jpg/1200px-Phat_Thai_kung_Chang_Khien_street_stall.jpg',
    menuImagePublicId: 'none',
    description: 'best thai food',
    restaurantId: 1,
    categoryId: 1,
  },
  {
    name: 'thai tea',
    price: 40,
    menuImage:
      'https://www.honestfoodtalks.com/wp-content/uploads/2021/11/iced-thai-tea-with-white-straw-1.jpg',
    menuImagePublicId: 'none',
    description: 'best thai food',
    restaurantId: 1,
    categoryId: 1,
  },
  {
    name: 'thai green curry',
    price: 32,
    menuImage:
      'https://www.recipetineats.com/wp-content/uploads/2019/02/Thai-Green-Curry_5.jpg',
    menuImagePublicId: 'none',
    description: 'tranditional thai food',
    restaurantId: 1,
    categoryId: 1,
  },
  {
    name: 'croissant',
    price: 35,
    menuImage:
      'https://img.freepik.com/free-photo/croissants-wooden-cutting-board_1150-28480.jpg?w=2000',
    menuImagePublicId: 'none',
    description: 'french croissant',
    restaurantId: 2,
    categoryId: 2,
  },
  {
    name: 'Andre',
    price: 55,
    menuImage:
      'https://img.restaurantguru.com/rf60-Andre-restaurant-seafood.jpg',
    menuImagePublicId: 'none',
    description: 'andre',
    restaurantId: 2,
    categoryId: 2,
  },
  {
    name: 'Flamiche',
    price: 34,
    menuImage:
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Tarte_Flamiche.jpg',
    menuImagePublicId: 'none',
    description: 'flamiche',
    restaurantId: 2,
    categoryId: 2,
  },
  {
    name: 'Peking Roasted Duck',
    price: 65,
    menuImage:
      'https://redhousespice.com/wp-content/uploads/2022/01/sliced-peking-duck-with-pancakes-scaled.jpg',
    menuImagePublicId: 'none',
    description: 'most well-known chinese cuisine',
    restaurantId: 3,
    categoryId: 3,
  },
  {
    name: 'Kung Pao Chicken',
    price: 70,
    menuImage:
      'https://cafedelites.com/wp-content/uploads/2018/04/Best-Kung-Pao-Chicken-IMAGE-2.jpg',
    description:
      'Kung Pao is made with chicken, vegetables, nuts, and Szechuan peppers. Szechuan: Szechuan cuisine typically uses Szechuan peppers, vegetables, mushrooms, herbs, pork, beef, rabbit, and yogurt.',
    menuImagePublicId: 'none',
    restaurantId: 3,
    categoryId: 3,
  },
  {
    name: 'Chineses Dumplings',
    price: 80,
    menuImage:
      'https://images-gmi-pmc.edge-generalmills.com/c1517889-0f2c-4de2-895a-69dbc16cd9d9.jpg',
    description: 'dumplings',
    menuImagePublicId: 'none',
    restaurantId: 3,
    categoryId: 3,
  },
];

const menuOptionGroups = [
  {
    name: 'size',
    numberLimit: 1,
    menuId: 1,
  },
  {
    name: 'flavor',
    numberLimit: 1,
    menuId: 1,
  },
  {
    name: 'size',
    numberLimit: 1,
    menuId: 2,
  },
  {
    name: 'flavor',
    numberLimit: 1,
    menuId: 2,
  },
];

const menuOptions = [
  {
    name: 'S',
    price: 0,
    menuOptionGroupId: 1,
  },
  {
    name: 'M',
    price: 1,
    menuOptionGroupId: 1,
  },
  {
    name: 'L',
    price: 3,
    menuOptionGroupId: 1,
  },
  {
    name: 'sweet',
    price: 0,
    menuOptionGroupId: 2,
  },
  {
    name: 'salt',
    price: 0,
    menuOptionGroupId: 2,
  },
  {
    name: 'S',
    price: 0,
    menuOptionGroupId: 3,
  },
  {
    name: 'M',
    price: 1,
    menuOptionGroupId: 3,
  },
  {
    name: 'L',
    price: 3,
    menuOptionGroupId: 3,
  },
  {
    name: 'sweet',
    price: 0,
    menuOptionGroupId: 4,
  },
  {
    name: 'salt',
    price: 0,
    menuOptionGroupId: 4,
  },
];

const menuTags = [
  {
    menuId: 1,
    tagId: 1,
  },
  {
    menuId: 1,
    tagId: 2,
  },
  {
    menuId: 2,
    tagId: 1,
  },
  {
    menuId: 2,
    tagId: 2,
  },
];

const categories = [
  {
    name: 'other',
    restaurantId: 1,
  },
  {
    name: 'other',
    restaurantId: 2,
  },
  {
    name: 'other',
    restaurantId: 3,
  },
];

const seed = async () => {
  const t = await sequelize.transaction();
  try {
    await Customer.bulkCreate(customers, { transaction: t });
    await Restaurant.bulkCreate(restaurants, { transaction: t });
    await Category.bulkCreate(categories, { transaction: t });
    await Driver.bulkCreate(drivers, { transaction: t });
    await Tag.bulkCreate(
      foodTags.map((tag) => ({ name: tag })),
      { transaction: t },
    );
    await Menu.bulkCreate(menus, { transaction: t });
    await MenuOptionGroup.bulkCreate(menuOptionGroups, { transaction: t });
    await MenuOption.bulkCreate(menuOptions, { transaction: t });
    await MenuTag.bulkCreate(menuTags, { transaction: t });
    await Order.bulkCreate(order, { transaction: t });
    await OrderMenu.bulkCreate(orderMenu, { transaction: t });
    await OrderMenuOptionGroup.bulkCreate(orderMenuOptionGroup, {
      transaction: t,
    });
    await OrderMenuOption.bulkCreate(orderMenuOption, { transaction: t }); //error

    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

seed();
