const fs = require('fs');
const path = require('path');

 module.exports = class Product { 
    constructor(title) {
        this.title = title;
    }

    save() { 
        const p = path.join(
            path.dirname(require.main.filename), 
            'data', 
            'products.json');

        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                try {
                    products = JSON.parse(fileContent);
                } catch (parseErr) {
                    console.log('Error parsing JSON:', parseErr);
                }
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll() {
        const p = path.join(
            path.dirname(require.main.filename), 
            'data', 
            'products.json');
            
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return [];
            }
            return JSON.parse(fileContent);
        });
     }
}