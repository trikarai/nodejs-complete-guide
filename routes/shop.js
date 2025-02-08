const express = require('express');
const path = require('path');
const router = express.Router();    

const rootDir = require('../utils/path.js');
const adminData = require('./admin');   


router.get('/', (req, res, next) => {
    // console.log('shop.js', adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', {prods: adminData.products, docTitle: 'Shop'});
});


module.exports = router;