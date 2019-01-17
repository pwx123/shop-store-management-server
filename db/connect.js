var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop_store_management'
});

connection.connect(function (err) {
    if (err) {
      console.error('连接错误: ' + err.stack);
      return;
    }
    console.log('数据库连接成功');
})

module.exports = connection;