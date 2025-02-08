const http = require('http');

const express = require('express');

const app = express();

// app.use((req, res, next) => {
//     console.log('In the First middleware!');
//     next(); // Allows the request to continue to the next middleware in line
// });

// app.use((req, res, next) => {
//     console.log('In second middleware!');
//     res.send('<h1>Hello from Express!</h1>');
// });

app.use('/users', (req, res, next) => {
    console.log('/ middleware!');
    res.send('<h1>The "Users" Page</h1>');
});

app.use('/', (req, res, next) => {
    console.log('/ users middleware!');
    res.send('<h1>The "Home" Page</h1>');
});

const server = http.createServer(app);

server.listen(3000);
