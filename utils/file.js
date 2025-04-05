const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
   fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
}

exports.deleteFile = deleteFile;