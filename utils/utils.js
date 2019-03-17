const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const Op = sequelize.Op;
const errorMsg = require('./errorMsg');

const ALLCHAR = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'; // 去掉了容易混淆的字符
const ALLNUM = '123456789';

// res返回数据
let resMsg = function (errorCode = 9999, data = '') {
  return {
    errorCode,
    errorMsg: errorMsg[errorCode],
    data
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
 * 获取不为空的数值组成的sequelize WHERE 查询对象
 *
 * @param {Object} params 要拼接参数
 * @returns {Object}
 */
let getUncertainSqlObj = function (params) {
  let obj = {};
  for (key in params) {
    let val = params[key];
    if (!hasEmpty(val)) {
      obj[key] = val;
    }
  }
  return obj;
}

/**
 * 获取不为空的数值组成的sequelize WHERE LIKE 查询对象
 *
 * @param {Object} params 需要LIKE的参数
 * @returns {Object}
 */
let getUncertainLikeSqlObj = function (params) {
  let obj = {};
  for (key in params) {
    let val = params[key];
    if (!hasEmpty(val)) {
      obj[key] = {};
      obj[key][Op.like] = `%${val}%`;
    }
  }
  return obj;
}

let getRandomPwd = function () {
  return getRandomStr(6) + getRandomStrNum(4);
}

let getRandomStr = function (len) {
  let str = '';
  let maxLength = ALLCHAR.length;
  for (i = 0; i < len; i++) {
    str += ALLCHAR.charAt(Math.floor(Math.random() * maxLength));
  }
  return str;
}

let getRandomStrNum = function (len) {
  let str = '';
  let maxLength = ALLNUM.length;
  for (i = 0; i < len; i++) {
    str += ALLNUM.charAt(Math.floor(Math.random() * maxLength));
  }
  return str;
}

const mobileReg = /^1[3456789]\d{9}$/;
const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;

module.exports = {
  resMsg,
  hasEmpty,
  getUncertainSqlObj,
  getUncertainLikeSqlObj,
  mobileReg,
  pwdReg,
  getRandomPwd
}