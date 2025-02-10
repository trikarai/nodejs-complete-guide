const express = require('express');
const path = require('path');
const router = express.Router();    

const shopController = require('../controllers/shop.js');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCarts);

router.get('/checkout', shopController.getCheckout);

module.exports = router;