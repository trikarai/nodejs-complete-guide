const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
      res.locals.path = req.path; // Makes path available in all views
      next();
  });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
      res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

const server = http.createServer(app);

server.listen(3000);
