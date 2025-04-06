const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {

  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 2;
  let startIndex = (page - 1) * ITEM_PER_PAGE;
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = +numProducts;
      return Product.find().skip(startIndex).limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        meta: {
          totalItems: totalItems,
          currentPage: +page,
          firstPage: 1,
          hasNextPage: ITEM_PER_PAGE * page < totalItems,
          hasPreviousPage: parseInt(page) > 1,
          nextPage: parseInt(page) + 1,
          previousPage: parseInt(page) - 1,
          lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
          totalPages: Math.ceil(totalItems / ITEM_PER_PAGE),
        },
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {

  const page = req.query.page || 1;
   const ITEM_PER_PAGE = 2;
  let startIndex = (page - 1) * ITEM_PER_PAGE;
  let totalItems = 0;
  
  Product
    .find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = +numProducts;
      return Product.find()
        .skip(startIndex)
        .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        meta: {
          totalItems: totalItems,
          currentPage: +page,
          firstPage: 1,
          hasNextPage: ITEM_PER_PAGE * page < totalItems,
          hasPreviousPage: parseInt(page) > 1,
          nextPage: parseInt(page) + 1,
          previousPage: parseInt(page) - 1,
          lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
          totalPages: Math.ceil(totalItems / ITEM_PER_PAGE),
        },
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  const user = req.user;

  user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        products: products,
        pageTitle: "Your Cart",
        path: "/cart",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const user = req.user;
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;

  user
    .deleleItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  const user = req.user;
  const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;

  let products = [];
  let totalPrice = 0;

  user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;

      totalPrice =  products.reduce((total, item) => {
        return total + item.quantity * item.productId.price;
      }, 0);

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((item) => {
          return {
            // Stripe requires the price to be in cents
            // and the currency to be in lowercase
            price_data: {
              currency: "usd",
              product_data: {
                name: item.productId.title,
                description: item.productId.description,
              },
              unit_amount: item.productId.price * 100,
            },
            quantity: item.quantity,
          };
        }),
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
        cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        products: products,
        pageTitle: "Checkout",
        path: "/checkout",
        totalPrice: totalPrice,
        isAuthenticated: req.session.isLoggedIn,
        stripePublicKey: STRIPE_PUBLIC_KEY,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getCheckoutSuccess = (req, res, next) => {
  const user = req.user;
  const sessionId = req.body.sessionId;
  const order = new Order({
    user: {
      email: user.email,
      userId: user,
    },
    products: user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    }),
  });
  order
    .save()
    .then(() => {
      return user.clearCart();
    })
    .then(() => {
      res.status(201).json({ message: "Success", orderId: order._id });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  const user = req.user;
  user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: user.email,
          userId: user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  const user = req.user;

  Order.find({ "user.userId": user._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders: orders,
        pageTitle: "Your Orders",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrderInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
   Order.findById(orderId)
    .then((order) => {
       if (!order) {
        return next(new Error("No order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("-------------------------");
      pdfDoc.text("Order ID: " + orderId);
      pdfDoc.text("-------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$" +
              prod.product.price
          );
      });
      pdfDoc.text("-------------------------");
      pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);
      pdfDoc.text("-------------------------");
      pdfDoc.text("Thank you for your order!");
      pdfDoc.end();
    })
    .catch((err) => next(err));
};
