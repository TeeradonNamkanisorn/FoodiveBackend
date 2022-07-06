const router = require('express').Router();
const multer = require('../middlewares/upload');
const { uploadImage } = require('../middlewares/cloudinaryUploads');
const driverController = require('../controllers/driverController');

router.get('/getMe', driverController.getMe);
router.put(
  '/update',
  multer.single('driverImage'),
  uploadImage,
  driverController.updateProfile,
);
router.patch('/updateStatus', driverController.updateStatus);
router.patch('/updateLocation', driverController.updateLocation);

router.post('/searchOrder', driverController.searchOrder);

router.get('/order/:orderId', driverController.getOrderById);
router.get('/orderDetail/:orderId', driverController.getOrderDetailById);
router.get('/getIncome', driverController.getIncome);
router.patch('/orderAccepted/:id', driverController.acceptOrder);
router.patch('/deliveringStatus/:id', driverController.deliveringStatus);
router.patch('/deliveredStatus/:id', driverController.deliveredStatus);
router.get('/getFee/:id', driverController.getDeliveryFee);
router.get('/currentOrder', driverController.getCurrentOrder);
module.exports = router;
