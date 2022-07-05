const router = require('express').Router();
const multer = require('../middlewares/upload');
const customerController = require('../controllers/customerController');
const omiseController = require('../controllers/omiseController');
const orderController = require('../controllers/orderController');
const { uploadImage } = require('../middlewares/cloudinaryUploads');
const authenticator = require('../middlewares/authenticator');

router.get('/getMe', customerController.getMe);
router.post('/restaurant/:id', customerController.getRestaurantById);
router.delete('/deleteMenu/:orderMenuId', customerController.removeMenu);
router.put('/modifyMenu', customerController.modifyMenu);
router.put(
  '/update',
  multer.single('profileImage'),
  uploadImage,
  customerController.updateProfile,
);
router.post('/address', customerController.createAddress);
router.delete('/address/:addressId', customerController.deleteAddress);
router.post('/searchMenus', customerController.fetchMenus);
router.get('/getMenu/:menuId', customerController.getMenuById);

router.post('/allRestaurants', customerController.getAllRestaurant);
router.post('/cart/:cartId/append-menu', customerController.addMenusToCart);
router.get('/restaurantsCart', customerController.getAllRestaurantsOfCarts);
router.post('/addCart', customerController.createCart);
router.get('/cart/:cartId', customerController.getCart);
router.get('/carts', customerController.getAllCarts);
router.post(
  '/confirmCart/:orderId',
  omiseController.chargeCustomer,
  orderController.fillCart,
);

module.exports = router;
