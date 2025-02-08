const express = require('express');
const path = require('path');
const router = express.Router();    

const rootDir = require('../utils/path.js');
const adminData = require('./admin');   


router.get('/', (req, res, next) => {
     const products = adminData.products;
     res.render('shop', {prods: products, docTitle: 'Shop'});
});


module.exports = router;