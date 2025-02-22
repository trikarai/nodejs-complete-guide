const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const imageId = Math.floor(Math.random() * 999) + 1;

  const imageUrl = `https://picsum.photos/id/${imageId}/200/100`;
  const price = req.body.price;
  const description = req.body.description;

  const user = req.user;
 
  user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
   }).then(() => {
    console.log('Product Created');
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  }); 
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  req.user.getProducts({ where: { id: prodId } })
     .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  // const updatedImageUrl = req.body.imageUrl;
  const updatedImageUrl = `https://picsum.photos/id/${prodId}/200/100`;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then(() => {
      console.log('Product Updated');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
      })
    }).catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.destroy({
    where: {
      id: prodId
    }
  })
    .then(() => {
      console.log('Product Deleted');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
 };
