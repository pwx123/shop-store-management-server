const connection = require('../db/connect');
const errorMsg = require('./errorMsg');

const SESSION_SALT = '9NRrE9iideRWxNdc9JkCH_o3YVQ6Xtlq'; // session 加盐

// res返回数据
let resMsg = function (errorCode = 9999, data = '') {
  return {
    errorCode,
    errorMsg: errorMsg[errorCode],
    data
  }
}

// mysql查询封装
let connectionQuery = function (sql, sqlParams) {
  return new Promise((resolve, reject) => {
    connection.query(sql, sqlParams, function (err, result) {
      if (err) {
        reject(9999);
      }
      resolve(result);
    });
  })
}

module.exports = {
  resMsg,
  connectionQuery,
  SESSION_SALT
}