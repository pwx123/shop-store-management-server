/* 错误提示 */
const errorMsg = {
  200: '请求成功',
  401: '登陆过期或未登录，请重新登陆',
  404: '请求不存在',
  1001: '用户不存在',
  1002: '密码错误',
  1003: '用户已存在',
  1004: '两次密码不一致',
  1005: '原密码错误',
  2001: '表格中没有数据',
  9001: '参数错误',
  9999: '系统错误'
}

module.exports = errorMsg;