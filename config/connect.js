const mysql = require('mysql');
require('dotenv').config();

// create connection
const connection = mysql.createConnection({
  host      : process.env.host,
  user      : process.env.db_user,
  password  : process.env.db_password,
  database  : process.env.database
});

connection.connect();

module.exports = connection;