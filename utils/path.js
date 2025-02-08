const path = require('path');

// This will give us the path to the main file that started the application. In this case, it will give us the path to app.js
module.exports = path.dirname(require.main.filename); 