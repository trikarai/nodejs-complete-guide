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
const Product = require('./models/product');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

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

sequelize.sync({force: true})
  .then(() => {
    console.log('Database connected!');
    server.listen(3000);
  })
  .catch(err => {
    console.log(err);
});
