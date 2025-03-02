const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");  

  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // find the user with the email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("No user found");
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      // compare the password
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword

  // check if the email is already in the database
  User.findOne({ email: email })
    .then((userDoc) => {
    if (userDoc) {
      req.flash("error", "Email already exists.");
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
}  

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
        return res.redirect("/reset");
      })
      .then((result) => {
        console.log(`http://localhost:3000/reset/${token}`);
      });
      // .then((result) => {
        // res.redirect("/");
        // transporter.sendMail({
        //   to: req.body.email,
        //   from: "shop@node-complete.com",
        //   subject: "Password Reset",
        //   html: `
        //     <p>You requested a password reset</p>
        //     <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        //   `,
        // });
      // });
  });
}