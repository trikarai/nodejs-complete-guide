const { ObjectId } = require('mongodb')
const { getDB } = require('../utils/database')

class Product {
  constructor(title, price, imageUrl, description){
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl
    this.description = description
  }

  save(){
     const db = getDB();
     return db.collection('products')
      .insertOne(this)
      .then((result) => {
        console.log(result) 
      }).catch((err) => {
        console.log(err)
      });
  }

  static fetchAll() {
    const db = getDB();
    return db.collection("products")
      .find().toArray()
      .then(products => {
        console.log(products);
        return products
        
      })
      .catch(err=> {
        console.log(err);
      })
  }

  static findById(prodId){
    const db = getDB();
    return db.collection('products')
      .find({ _id: new ObjectId(prodId) }).next()
      .then(product => {
        return product
      })
      .catch(err =>{
        console.log(err);
      })
  }
} 

module.exports = Product;