const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const Op = sequelize.Op;
const errorMsg = require("./errorMsg");

const ALLCHAR = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz"; // 去掉了容易混淆的字符
const ALLNUM = "123456789";

// res返回数据
let resMsg = function (errorCode = 9999, data = "") {
  return {
    errorCode,
    errorMsg: errorMsg[errorCode],
    data
  };
};

/**
 * 判断多个数值是否是有效值
 *
 * @param {*} params
 * @returns
 */
let hasEmpty = function (...params) {
  for (let i = 0, len = params.length; i < len; i++) {
    let val = params[i];
    if (val === "" || val === undefined || val === null || (typeof val === "number") && isNaN(val)) {
      return true;
    }
  }
  return false;
};

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
};

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
};

let getRandomPwd = function () {
  return getRandomStr(6) + getRandomStrNum(4);
};

let getRandomStr = function (len) {
  let str = "";
  let maxLength = ALLCHAR.length;
  for (i = 0; i < len; i++) {
    str += ALLCHAR.charAt(Math.floor(Math.random() * maxLength));
  }
  return str;
};

let getRandomStrNum = function (len) {
  let str = "";
  let maxLength = ALLNUM.length;
  for (i = 0; i < len; i++) {
    str += ALLNUM.charAt(Math.floor(Math.random() * maxLength));
  }
  return str;
};

/**
 * 获取 yyyyMMddHHmmss 时间
 *
 * @memberof autoCreateOrder
 */
let getDataStr = function () {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = padLeft(2, date.getDate());
  let hour = padLeft(2, date.getHours());
  let minute = padLeft(2, date.getMinutes());
  let second = padLeft(2, date.getSeconds());
  return `${year}${month}${day}${hour}${minute}${second}`;
};

/**
 * 左补全
 * @param len
 * @param num
 * @returns {string}
 */
let padLeft = function (len, num) {
  return new Array(len - (num + "").length + 1).join("0") + num;
};

/**
 * 获取退款流水号
 * @param userId 用户id
 * @returns {string}
 */
let getRefundOrderId = function (userId) {
  let str = "T";
  str += padLeft(9, userId);
  str += getDataStr();
  return str;
};

/**
 * 生成随机数
 *
 * @param {Number} lower 最小值
 * @param {Number} upper 最大值
 * @returns
 * @memberof autoCreateOrder
 */
let getRandom = function(lower, upper) {
  return Math.floor(Math.random() * (upper - lower)) + lower;
};

const mobileReg = /^1[3456789]\d{9}$/;
const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
const numReg = /^[0-9]+$/;

module.exports = {
  resMsg,
  hasEmpty,
  getUncertainSqlObj,
  getUncertainLikeSqlObj,
  mobileReg,
  pwdReg,
  numReg,
  getRandom,
  getRandomPwd,
  getRefundOrderId
};