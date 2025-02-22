require("dotenv").config();

const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');

const User = require('./models/user');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("67b1b000a412069cda12a5b6")
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
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

app.use(errorController.get404Page);

const server = http.createServer(app);

 mongoose
  .connect(process.env.MONGODB_URI).then(() => {
    app.listen(3000);
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.log(err));