const mysql = require('mysql');

// create connection
const connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'matcha',
  password  : '123456',
  database  : 'matcha',
});

connection.connect();

module.exports = connection;