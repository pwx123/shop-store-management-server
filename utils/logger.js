/* 请求头打印 */
const morgan = require('morgan');

morgan.token('requestParameters', function(req, res){
  return JSON.stringify(req.query) || '-';
});
morgan.token('requestBody', function(req, res){
  return JSON.stringify(req.body) || '-';
});
morgan.format('live-api', ':method :url :status :requestParameters :requestBody');

module.exports = morgan;