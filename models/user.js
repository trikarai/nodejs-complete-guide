const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
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
