const { path } = require('express/lib/application');
const Product = require('../models/product'); // Import the Product class

exports.getProducts = (req, res, next) => {
   Product.fetchAll(products => { 
     res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Product List',
        path: '/product-list',
      });
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => { 
    res.render('shop/index', {
       prods: products,
       pageTitle: 'Shop',
       path: '/',
     });
   });
};


exports.getCarts = (req, res, next) => {
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
    });
};

