const { path } = require('express/lib/application');
const Product = require('../models/product'); // Import the Product class

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => { 
      res.render('admin/products', {
         prods: products,
         pageTitle: 'Admin Products',
         path: '/', 
        });
     });
 };

exports.getAddProducts = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
      });
};

exports.getEditProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
     });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};
