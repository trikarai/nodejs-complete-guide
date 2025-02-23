require("dotenv").config();

const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');

const User = require('./models/user');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  User.findById("67ba7bd70514035140f5d147")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
 });

app.use((req, res, next) => {
      res.locals.path = req.path; // Makes path available in all views
      next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

const server = http.createServer(app);

 mongoose
  .connect(process.env.MONGODB_URI).then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Tri",
          email: "hello@trisutrisno.id",
          cart: {
            items: [],
          },
        });
      user.save();
      }
    });
    server.listen(3000);
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.log(err));