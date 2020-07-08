const connection = require('./connect');
const faker = require('faker');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const moment = require('moment');

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

let userArray = [];

// Hydrate database with 10 users
// #1
var userArrayObject1 = [
  "Vernon",
  "Vernon",
  "Dursley",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Male",
  "Hetro",
  new Date("1954-09-11"),
  age(new Date("1954-09-11")),
  "Location: WTC; Male/Hetro; #Traveling #Outdoors #Pets #Music",
  "#Traveling",
  "#Outdoors",
  "#Pets",
  "#Music",
  "Johannesburg",
  -26.205071, 
  28.040175,
  faker.random.number({'min':1, 'max':10}),
  "userPic-vernon.jpg",
  "",
  "",
  "",
  "",
  'N',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject1);
// #2
var userArrayObject2 = [
  "Petunia",
  "Petunia",
  "Evans",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Female",
  "Hetro",
  new Date("1958-09-03"),
  age(new Date("1958-09-03")),
  "Location: Carlton centre; Female/Hetro; #Traveling #Outdoors #Pets #Music",
  "#Traveling",
  "#Outdoors",
  "#Pets",
  "#Music",
  "Johannesburg",
  -26.205370,
  28.046240, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-petunia.jpg",
  "",
  "",
  "",
  "",
  'Y',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject2);
// #3
var userArrayObject3 = [
  "Arthur",
  "Arthur",
  "Weasley",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Male",
  "Hetro",
  new Date("1950-02-06"),
  age(new Date("1950-02-06")),
  "Location: Freedom park; Male/Hetro; #Dancing #Cooking #Sports #Learning",
  "#Dancing",
  "#Cooking",
  "Sports",
  "#Learning",
  "Johannesburg",
  -26.289411,
  27.895595, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-arthur.jpg",
  "",
  "",
  "",
  "",
  'Y',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject3);
// #4
var userArrayObject4 = [
  "Molly",
  "Molly",
  "Prewett",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Female",
  "Hetro",
  new Date("1949-10-30"),
  age(new Date("1949-10-30")),
  "Location: Gold reef city; Female/Hetro; #Dancing #Cooking #Pets #Music",
  "#Dancing",
  "#Cooking",
  "#Pets",
  "#Music",
  "Johannesburg",
  -26.238743,
  28.013272, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-molly.jpg",
  "",
  "",
  "",
  "",
  'N',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject4);
// #5
var userArrayObject5 = [
  "Ron",
  "Ron",
  "Weasley",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Male",
  "Hetro",
  new Date("1980-03-01"),
  age(new Date("1980-03-01")),
  "Location: Morris isaacson; Male/Hetro; #Traveling #Outdoors #Pets #Music",
  "#Traveling",
  "#Outdoors",
  "#Sports",
  "#Music",
  "Johannesburg",
  -26.246148, 
  27.872434, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-ron.jpg",
  "userPic-ron1.jpg",
  "userPic-ron2.jpg",
  "",
  "",
  'Y',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject5);
// #6
var userArrayObject6 = [
  "Cho",
  "Cho",
  "Chang",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Female",
  "Bi",
  new Date("1979-01-01"),
  age(new Date("1979-01-01")),
  "Location: Morris isaacson; Female/Bi; #Traveling #Outdoors #Photography #Music",
  "#Traveling",
  "#Outdoors",
  "#Photography",
  "#Music",
  "Johannesburg",
  -26.246148, 
  27.872434, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-cho1.jpg",
  "userPic-cho2.jpg",
  "",
  "",
  "",
  'N',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject6)
// #7
var userArrayObject7 = [
  "Albus",
  "Albus",
  "Dumbledore",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Male",
  "Homo",
  new Date("1881-08-30"),
  age(new Date("1881-08-30")),
  "Location: Morris isaacson; Male/Homo; #Traveling #Politics #Sports #Learning",
  "#Traveling",
  "#Politics",
  "#Sports",
  "#Learning",
  "Johannesburg",
  -26.246148, 
  27.872434, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-albus.jpg",
  "userPic-albus1.jpg",
  "",
  "",
  "",
  'Y',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject7)
// #8
var userArrayObject8 = [
  "Gellert",
  "Gellert",
  "Grindelwald",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Male",
  "Homo",
  new Date("1883-01-01"),
  age(new Date("1883-01-01")),
  "Location: Morris isaacson; Male/Homo; #Traveling #Politics #Photography #Learning",
  "#Traveling",
  "#Politics",
  "#Photography",
  "#Learning",
  "Johannesburg",
  -23.318257, 
  30.719293, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-gellert1.jpg",
  "",
  "",
  "",
  "",
  'Y',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject8)
// #9
var userArrayObject9 = [
  "Dolores",
  "Dolores",
  "Umbridge",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Female",
  "Homo",
  new Date("1965-08-26"),
  age(new Date("1965-08-26")),
  "Location: Pretoria; Female/Homo; #Dancing #Politics #Pets #Art",
  "#Dancing",
  "#Politics",
  "#Pets",
  "#Art",
  "Johannesburg",
  -25.740178, 
  28.211980, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-umbridge.jpg",
  "",
  "",
  "",
  "",
  'Y',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject9)
// #10
var userArrayObject10 = [
  "Severus",
  "Severus",
  "Snape",
  faker.internet.email(),
  "",
  bcrypt.hashSync("123456Aa", 10),
  uniqid() + uniqid(),
  uniqid() + uniqid(),
  'Y',
  "Male",
  "Hetro",
  new Date("1960-01-09"),
  age(new Date("1960-01-09")),
  "Location: Hillbrow; Male/Hetro; #Dancing #Cooking #Photography #Art",
  "#Dancing",
  "#Cooking",
  "#Photography",
  "#Art",
  "Johannesburg",
  -26.199592, 
  28.046665, 
  faker.random.number({'min':1, 'max':10}),
  "userPic-snape.gif",
  "",
  "",
  "",
  "",
  'Y',
  faker.date.recent(),
  0,
  1
];
userArray.push(userArrayObject10)


var sql = "INSERT INTO users (username, firstname, lastname, email, altEmail, password, token, viewToken, verified, gender, sexualOrientation, dateOfBirth, age, bio, interest1, interest2, interest3, interest4, city, lat, lng, popularity, profilePicture, pic1, pic2, pic3, pic4, online, lastOn, suspended, extProfComp) VALUES ?";
connection.query(sql, [userArray], (err) => {
  if (err) throw err;
  console.log('\x1b[35m%s\x1b[0m', 'Database hydrated with marking data');
  connection.end();
})
