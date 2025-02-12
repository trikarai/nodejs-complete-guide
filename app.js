const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');

const sequelize = require('./utils/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');

// Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use((req, res, next) => {
      res.locals.path = req.path; // Makes path available in all views
      next();
  });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

const server = http.createServer(app);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
// .sync({ force: true })
.sync()
.then(() => {
  return User.findByPk(1);
})
.then(user => {
  if (!user) {
    return User.create({ name: 'Tri', email: 'hello@trisutrisno.id', password: 'password' });
  }
  return user;
})
.then((user) => {
  return user.createCart();

}).then(cart => {
  console.log('Database connected!');
  server.listen(3000);
})
  .catch(err => {
    console.log(err);
});
