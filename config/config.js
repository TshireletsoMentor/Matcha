const mysql = require('mysql');

// create connection
const connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'matcha',
  password  : '123456'
});

connection.connect();
console.log('\x1b[35m%s\x1b[0m', "Connected to MySql...");

connection.query('CREATE DATABASE IF NOT EXISTS matcha');
console.log('\x1b[35m%s\x1b[0m', ' Database \"matcha\" created');

connection.query('USE matcha');

connection.query(`CREATE TABLE IF NOT EXISTS users 
( id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, 
  username VARCHAR(100) NOT NULL, 
  firstname VARCHAR(100) NOT NULL, 
  lastname VARCHAR(100) NOT NULL, 
  email VARCHAR(255) NOT NULL, 
  altEmail VARCHAR(255),
  password VARCHAR(255) NOT NULL, 
  token VARCHAR(255) NOT NULL,
  viewToken VARCHAR(255) NOT NULL,
  verified VARCHAR(1) DEFAULT \'N\',
  gender VARCHAR(15),
  sexualOrientation VARCHAR(25) DEFAULT \'Bi\',
  dateOfBirth DATE,
  age INT,
  bio VARCHAR(10000),
  interest1 VARCHAR(50),
  interest2 VARCHAR(50),
  interest3 VARCHAR(50),
  interest4 VARCHAR(50),
  city VARCHAR(100),
  lat FLOAT,
  lng FLOAT,
  popularity INT DEFAULT \'5\',
  profilePicture VARCHAR(255),
  pic1 VARCHAR(255), 
  pic2 VARCHAR(255), 
  pic3 VARCHAR(255), 
  pic4 VARCHAR(255),
  online VARCHAR(1) DEFAULT \'N\',
  lastOn DATETIME,
  suspended INT DEFAULT \'0\',
  extProfComp INT DEFAULT \'0\'
 )`);
console.log('\x1b[35m%s\x1b[0m', '  TABLE: \"users\" CREATED');

connection.query(`CREATE TABLE IF NOT EXISTS likes 
( id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, 
  username VARCHAR(100) NOT NULL, 
  liked VARCHAR(100) NOT NULL
)`);
console.log('\x1b[35m%s\x1b[0m', '  TABLE: \"likes\" CREATED');

connection.query(`CREATE TABLE IF NOT EXISTS blocked 
( id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, 
  username VARCHAR(100) NOT NULL, 
  blocked VARCHAR(100) NOT NULL,
  date DATETIME,
  processed INT DEFAULT \'0\'
)`);
console.log('\x1b[35m%s\x1b[0m', '  TABLE: \"blocked\" CREATED');

connection.query(`CREATE TABLE IF NOT EXISTS profileviews 
( id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, 
  username VARCHAR(100) NOT NULL, 
  viewed VARCHAR(100) NOT NULL,
  date DATETIME
)`);
console.log('\x1b[35m%s\x1b[0m', '  TABLE: \"profileViews\" CREATED');

connection.query(`CREATE TABLE IF NOT EXISTS reports
( id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, 
  complainant VARCHAR(100) NOT NULL,
  complaintAbout VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL, 
  text VARCHAR(10000) NOT NULL,
  processed INT DEFAULT \'0\' 
)`);
console.log('\x1b[35m%s\x1b[0m', '  TABLE: \"reports\" CREATED');

connection.query(`CREATE TABLE IF NOT EXISTS chats
( id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, 
  sender VARCHAR(100) NOT NULL,
  receiver VARCHAR(100) NOT NULL,
  message VARCHAR(10000) NOT NULL, 
  date VARCHAR(100) 
)`);
console.log('\x1b[35m%s\x1b[0m', '  TABLE: \"chats\" CREATED');

// notifications
// chats
// connection.query();
// console.log('\x1b[35m%s\x1b[0m');
connection.end();