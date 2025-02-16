const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // { items: [] }
    this._id =  id;
  }

  save() {
    const db = getDB()

    let dbOp;

    dbOp = db.collection('users').insetOne(this)

     return dbOp
       .then((result) => {
         console.log(result);
       })
       .catch((err) => {
         console.log(err);
       });
  }

  addToCart(product){
    // const cartProduct = this.cart.items.findIndex(cp => {
    //     return cp._id = product._id
    // })
    const updatedCart = {items: [{ productId: new ObjectId(product._id) , quantity: 1}]};
    
    const db = getDB()

    db.collection('users').updateOne({_id: new ObjectId(this._id)}, { $set: { cart: updatedCart } })
  }

  static findById(userId) {
    const db = getDB()

    return db.collection('users').findOne({ _id: new ObjectId(userId) })
        .then((result) => {
            return result
        }).catch((err) => {
            console.log(err)
        });

  }
}

module.exports = User;
