const mysql = require('mysql');

// create connection
const connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'matcha',
  password  : '123456'
});

connection.connect();

connection.query('DROP DATABASE IF EXISTS matcha');
console.log('\x1b[31m%s\x1b[0m', 'DATABASE \"matcha\" has died');
connection.end();