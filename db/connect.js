var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop_store_management'
});

connection.connect();

module.exports = connection;
