const multer = require('../middlewares/upload');

const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const orderController = require('../controllers/orderController');
const { uploadImage } = require('../middlewares/cloudinaryUploads');

router.get('/getMe', restaurantController.getMe);

router.get(
  '/getAllCategory',
  restaurantController.getAllCategoryFromRestaurantId,
);

router.get('/getCategory/:categoryId', restaurantController.getCategoryById);

router.get('/getDelivery', orderController.getDeliveryPendingByRestaurant);

router.put(
  '/update',
  multer.single('image'),
  uploadImage,
  restaurantController.updateRestaurant,
);

router.patch(
  '/update/picture',
  multer.single('image'),
  uploadImage,
  orderController.editFoodPicture,
);

router.patch('/update/menu', orderController.editFoodMenu);

router.patch('/updateStatus', restaurantController.updateStatusRes);

router.patch('/updateAddress', restaurantController.updateAddressRes);

router.post(
  '/:restaurantId/addMenu',
  multer.single('menuImage'),
  uploadImage,
  restaurantController.addMenu,
);

router.post('/addCategory', restaurantController.addCategory);
router.delete(
  '/deleteCategory/:categoryId',
  restaurantController.deleteCategory,
);
router.post('/assignCategory', restaurantController.assignCategory);

router.put(
  '/:restaurantId/menu/:menuId',
  multer.single('menuImage'),
  uploadImage,
  restaurantController.editMenu,
);
// router.post(
//   '/:restaurantId/menu/:menuId/addOptions',
//   restaurantController.addOptions,
// );

// router.put(
//   '/:restaurantId/menu/:menuId/menu-options/',
//   restaurantController.modifyOptions,
// );

router.post('/assign-tags', restaurantController.assignTags);
router.put('/change-tags', restaurantController.changeTags);
router.get('/pickDriver', restaurantController.pickDriver);
router.get('/pendingOrders', orderController.restaurantGetPendingOrders);
router.patch('/pendingOrders/:orderId', orderController.restaurantUpdateOrder);
router.delete('/menu/:menuId', orderController.deleteMenu);

module.exports = router;
//
