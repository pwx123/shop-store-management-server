const connection = require('../db/connect');
const resUtils = require('./resUtils');

function connectionQuery(sql, sqlParams) {
  return new Promise((resolve, reject) => {
    connection.query(sql, sqlParams, function(err, result) {
      if (err) {
        reject(9999);
      }
      resolve(result);
    });
  })
}

module.exports.connectionQuery = connectionQuery;