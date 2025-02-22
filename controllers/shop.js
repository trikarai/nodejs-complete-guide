const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/'
      }); 
  }).catch(err => {
    console.log(err);
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
   Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      }); 
    }).catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {

  const user = req.user

  user.getCart().then(products => {
    res.render('shop/cart', {
      products: products,
      pageTitle: 'Your Cart',
      path: '/cart'
    });
    
  }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const user = req.user
  const prodId = req.body.productId;  
  Product.findById(prodId).then(product => {
     return user.addToCart(product);
  })
  .then(() => {
     res.redirect('/cart');
  })
  .catch(err => {
    console.log(err)
  })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;

  user
    .deleleItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const user = req.user;
  let fetchedCart;
  user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          }));
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const user = req.user;

  user.getOrders({include: ['products']})
    .then(orders => { 
       res.render('shop/orders', {
        orders: orders,
        path: '/orders',
        pageTitle: 'Your Orders',
      });
    })
    .catch(err => console.log(err));
};
