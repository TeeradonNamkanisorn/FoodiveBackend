const express = require('express');

const authRoute = express.Router();

const authController = require('../controllers/authController');

// GOOGLE LOGIN
authRoute.post('/login/google/:role', authController.googleLoginCustomer);

// RESTAURANT
authRoute.post('/register/restaurant', authController.registerRestaurant);
authRoute.post('/login/restaurant', authController.loginRestaurant);

// CUSTOMER
authRoute.post('/register/customer', authController.registerCustomer);
authRoute.post('/login/customer', authController.loginCustomer);

// DRIVER
authRoute.post('/register/driver', authController.registerDriver);
authRoute.post('/login/driver', authController.loginDriver);

module.exports = authRoute;

//
