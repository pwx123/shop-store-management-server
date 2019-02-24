const connection = require('../db/connect');
const errorMsg = require('./errorMsg');

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
        reject(err);
      }
      resolve(result);
    });
  })
}

/**
 * 分页数据格式化
 *
 * @param {Array} result sql分页查询结果
 * @param {Number} pageSize 每页数量
 * @param {Number} pageNumber 页码
 * @returns
 */
let paginationData = function (result, pageSize, pageNumber) {
  return {
    pageSize,
    pageNumber,
    total: result[1][0].total,
    rows: result[0]
  }
}

/**
 * 判断多个数值是否是有效值
 *
 * @param {*} params
 * @returns
 */
let hasEmpty = function (...params) {
  for (let i = 0, len = params.length; i < len; i++) {
    let val = params[i];
    if (val === '' || val === undefined || val === null || (typeof val === 'number') && isNaN(val)) {
      return true;
    }
  }
  return false;
}

/**
 * 拼接sql
 *
 * @param {Object} paramsObj 要拼接参数
 * @param {Boolean} isFirst 是否第一个 （是否添加WHERE）
 * @returns
 */
let splitSql = function (paramsObj, isFirst) {
  let i = 0;
  let sql = ' ';
  for (key in paramsObj) {
    let val = paramsObj[key];
    if (!hasEmpty(val)) {
      val = typeof val === 'number' ? val : `${val}`;
      if (i === 0 && isFirst) {
        sql += `WHERE ${key}=${val} `;
      } else {
        sql += `AND ${key}=${val} `;
      }
      i++;
    }
  }
  return sql;
}

/**
 * 拼接sql Like
 *
 * @param {Object} paramsObj 要拼接参数
 * @param {Boolean} isFirst 是否第一个 （是否添加WHERE）
 * @returns
 */
let splitLikeSql = function (paramsObj, isFirst) {
  let i = 0;
  let sql = ' ';
  for (key in paramsObj) {
    let val = paramsObj[key];
    if (!hasEmpty(val)) {
      val = typeof val === 'number' ? val : `${val}`;
      if (i === 0 && isFirst) {
        sql += `WHERE ${key} LIKE '%${val}%' `;
      } else {
        sql += `AND ${key} LIKE '%${val}%' `;
      }
      i++;
    }
  }
  return sql;
}


module.exports = {
  resMsg,
  connectionQuery,
  paginationData,
  hasEmpty,
  splitSql,
  splitLikeSql
}