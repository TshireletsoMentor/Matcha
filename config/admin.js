const mysql = require('mysql');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
require('dotenv').config();

let connection = mysql.createConnection({
  host      : process.env.host,
  user      : process.env.db_user,
  password  : process.env.db_password,
  database  : process.env.database
});

//Creat admin account
var adminArr = [];
const password = bcrypt.hashSync("Admin123", 10);
var adminObj = [
  'admin',
  'admin',
  'admin', 
  'DontReply.Matcha@gmail.com',
  password,
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  'Admin',
  '1'
];
adminArr.push(adminObj);

setTimeout(() => {
  connection.connect((err) => {
    if (err) throw err;
    var sql = "SELECT * FROM users WHERE username = ?";
      connection.query(sql, ['admin'], (err, result) =>{
        if (err) throw err;
          if (!result.length) {
            var sql2 = "INSERT INTO users (username, firstname, lastname, email, password, token, viewToken, verified, bio, extProfComp) VALUES ?";
            connection.query(sql2, [adminArr], (err) => {
              if (err) throw err;
              console.log('\x1b[35m%s\x1b[0m', 'Admin added to database');
              connection.end();
            });
          }
      });
  });
}, 100);