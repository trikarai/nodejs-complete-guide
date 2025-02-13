const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');

const mongoConnect = require('./utils/database').mongoConnect;

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // User.findByPk(1).then(user => {
  //   req.user = user;
  //   next();
  // })
  // .catch(err => console.log(err));
  next()
});

app.use((req, res, next) => {
      res.locals.path = req.path; // Makes path available in all views
      next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

const server = http.createServer(app);

mongoConnect(() => {
   server.listen(3000);
});
