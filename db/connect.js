var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop_store_management',
  multipleStatements: true
});

connection.connect(function (err) {
    if (err) {
      console.error('mysql connction failed: ' + err.stack);
      return;
    }
    console.log('mysql connction success');
})

module.exports = connection;