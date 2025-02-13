require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then(client => {
      console.log('Connected!');
      _db = client.db()

      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (_db) {
    return _db
  } else {
    throw 'No Database Found!!'
  }
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
