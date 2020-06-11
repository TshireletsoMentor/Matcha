const connection = require('./connect');
const faker = require('faker')
const bcrypt = require('bcrypt')
const ImgPlaceholder = require('random-image-placeholder')
const imgGenerator = new ImgPlaceholder();
var Url = imgGenerator.generate();
const uniqid = require('uniqid');


function age(dateOfBirth){
  var year = dateOfBirth.getFullYear();
  var month = dateOfBirth.getMonth();
  var day = dateOfBirth.getDay();
  

  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var currentDay = currentDate.getDay();
  var age = currentYear - year;
  if(currentMonth < (month - 1)){
      age--;
  }
  if(((month - 1) == currentMonth) && (currentDay < day)){
      age--;
  }
  return (age);
}


function generateToken(length){

  var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var b = [];
  for( var i = 0; i < length; i++){
      var j = (Math.random() * (a.length-1).toFixed(0));
      b[i] = a[j]
  }
  return b.join("")
}


var yearArr = [];
for (var i = 1920; i <= 2001; i++){
    yearArr.push(i);
}
var monthArr = [];
for (var i = 1; i <= 12; i++){
    monthArr.push(i);
}
var dayArr = [];
for(var i = 1; i <= 30; i++){
    dayArr.push(i);
}
var sexOrArr = ["Bi", "Homo", "Hetro"];
var genderArr = ["Female", "Male"];
var onlineArr = ["Y", "N"];
var interest1Arr = ["#Traveling", "#Dancing", "#Exercise"];
var interest2Arr = ["#Outdoors","#Politics","#Cooking"];
var interest3Arr = ["#Pets", "#Sports", "#Photography"];
var interest4Arr = ["#Music", "#Learning", "#Art"];
let userArray = [];

//Creat admin account
var sql1 = "SELECT * FROM users WHERE username = ?";
connection.query(sql1, [
  'admin'
], (err, result) => {
  if (err) throw err;

  if(result.length == 0){
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

    var sql2 = "INSERT INTO users (username, firstname, lastname, email, password, token, viewToken, verified, bio, extProfComp) VALUES ?";
    connection.query(sql2, [adminArr], (err) => {
      if (err) throw err;
      console.log('\x1b[35m%s\x1b[0m', 'Admin added to database')
    })
  }
})



// Hydrate database with fake data
for (var i = 0; i <= 5; i++){

  // var randYear = yearArr[Math.floor(Math.random()*yearArr.length)];
  // var randMonth = monthArr[Math.floor(Math.random()*monthArr.length)];
  // var randDay = dayArr[Math.floor(Math.random()*dayArr.length)];
  var randSexOr = sexOrArr[Math.floor(Math.random()*sexOrArr.length)];
  var randGender = genderArr[Math.floor(Math.random()*genderArr.length)];
  var randOnline = onlineArr[Math.floor(Math.random()*onlineArr.length)];
  var hash = bcrypt.hashSync("123456Aa", 10);
  var token = uniqid() + uniqid();
  var viewToken = uniqid() + uniqid();
  var randinterest1 = interest1Arr[Math.floor(Math.random()*interest1Arr.length)]; 
  var randinterest2 = interest2Arr[Math.floor(Math.random()*interest2Arr.length)];
  var randinterest3 = interest3Arr[Math.floor(Math.random()*interest3Arr.length)];
  var randinterest4 = interest4Arr[Math.floor(Math.random()*interest4Arr.length)];
  var randPop = Math.floor(Math.random()*10);
  var dateOfBirth = faker.date.between(1920, 2001);

  var userArrayObject = [
    faker.name.firstName(),
    faker.name.firstName(),
    faker.name.lastName(),
    faker.internet.email(),
    "",
    hash,
    token,
    viewToken,
    'Y',
    randGender,
    randSexOr,
    dateOfBirth,
    age(dateOfBirth),
    faker.lorem.sentence(),
    randinterest1,
    randinterest2,
    randinterest3,
    randinterest4,
    faker.address.city(),
    faker.address.latitude(),
    faker.address.longitude(),
    randPop,
    Url + '?' + Math.random(10000),
    "",
    "",
    "",
    "",
    randOnline,
    faker.date.recent(),
    0,
    1
  ];
  userArray.push(userArrayObject);

}
// userArray.forEach(element => {
//   console.log(element)
// });

var sql = "INSERT INTO users (username, firstname, lastname, email, altEmail, password, token, viewToken, verified, gender, sexualOrientation, dateOfBirth, age, bio, interest1, interest2, interest3, interest4, city, lat, lng, popularity, profilePicture, pic1, pic2, pic3, pic4, online, lastOn, suspended, extProfComp) VALUES ?";
connection.query(sql, [userArray], (err) => {
  if (err) throw err;
  console.log('\x1b[35m%s\x1b[0m', 'Database hydrated');
  connection.end();
})
