const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("67ba7bd70514035140f5d147")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword

   

  // check if the email is already in the database
  User.findOne({ email: email })
    .then((userDoc) => {
    if (userDoc) {
      return res.redirect("/signup");
    }
    // if the email is not in the database, hash the password
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        // create a new user with the email and hashed password
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
      });
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
