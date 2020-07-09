const mysql = require('mysql');
require('dotenv').config();

// create connection
const connection = mysql.createConnection({
  host      : process.env.host,
  user      : process.env.db_user,
  password  : process.env.db_password
});

connection.connect();

connection.query('DROP DATABASE IF EXISTS matcha');
console.log('\x1b[31m%s\x1b[0m', 'DATABASE \"matcha\" has died');
connection.end();