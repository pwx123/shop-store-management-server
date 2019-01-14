/* 返回json */
const errorMsg = require('./../utils/errorMsg');

function resMsg(errorCode = 9999, data = '') {
  return {
    errorCode,
    errorMsg: errorMsg[errorCode],
    data
  }
}

function resSuccess(data = '') {
  return {
    errorCode: 200,
    errorMsg: errorMsg[200],
    data
  }
}

module.exports.resMsg = resMsg;
module.exports.resSuccess = resSuccess;