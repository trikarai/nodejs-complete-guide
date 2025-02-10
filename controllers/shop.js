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

exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
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

exports.getOrders = (req, res, next) => {
    res.render('shop/order', {
      pageTitle: 'Your Orders',
      path: '/orders',
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
    });
};

