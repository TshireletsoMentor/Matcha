const faker = require('faker')
const bcrypt = require('bcrypt')
const client = require('../config/connect');
const dbname = "Matcha";
const ImgPlaceholder = require('random-image-placeholder')
const imgGenerator = new ImgPlaceholder();
var Url = imgGenerator.generate()

function age(year, month, day){
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDay();
    var age = currentMonth - year;
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
let userArr = [];

for (var i = 0; i <= 100; i++){

    var randYear = yearArr[Math.floor(Math.random()*yearArr.length)];
    var randMonth = monthArr[Math.floor(Math.random()*monthArr.length)];
    var randDay = dayArr[Math.floor(Math.random()*dayArr.length)];
    var randSexOr = sexOrArr[Math.floor(Math.random()*sexOrArr.length)];
    var randGender = genderArr[Math.floor(Math.random()*genderArr.length)];
    var randOnline = onlineArr[Math.floor(Math.random()*onlineArr.length)];
    var hash = bcrypt.hashSync("123456Aa", 10);
    var token = generateToken(32);
    var viewToken = generateToken(32);
    var randinterest1 = interest1Arr[Math.floor(Math.random()*interest1Arr.length)]; 
    var randinterest2 = interest2Arr[Math.floor(Math.random()*interest2Arr.length)];
    var randinterest3 = interest3Arr[Math.floor(Math.random()*interest3Arr.length)];
    var randinterest4 = interest4Arr[Math.floor(Math.random()*interest4Arr.length)];
    var randPop = Math.floor(Math.random()*10);
    var randEmail = faker.internet.email();

        var userObj = {
            username: faker.name.firstName,
            firstname: faker.name.firstName,
            lastname: faker.name.lastName,
            email: randEmail,
            altEmail: "",
            password: hash,
            token: token,
            viewToken: viewToken,
            verified:'Y',
            gender: randGender,
            sexualOrientation: randSexOr,
            dateOfBirth: [randYear, randMonth, randDay],
            age: age(randYear, randMonth, randDay),
            bio: faker.lorem.sentence(),
            interests: 
            {
                i1: randinterest1,
                i2: randinterest2,
                i3: randinterest3,
                i4: randinterest4
            },
            location: 
            {
                city: faker.address.city(),
                lat: faker.address.latitude(),
                long: faker.address.longitude()
            },
            popularity: randPop,
            profilePicture: Url + '?' + Math.random(10000),
            pic1: "",
            pic2: "",
            pic3: "",
            pic4: "",
            online: randOnline,
            lastOn: faker.date.recent(),
            suspended: 0,
            blocked: [],
            likedBy: [],
            myLikes: [],
            profileViews: [],
            extProfComp: 1
        };
    userArr.push(userObj);
}

client.connect((err, db) => {
    if(err) throw err;
    dbObj = client.db(dbname)

    for (var i = 0; i < userArr.length; i++){

        dbObj.collection("users").insertOne(userArr[i], (err, result) => {
            if (err) throw err;
        })
    }
    db.close();
});
console.log(`${userArr.length} new accounts added to database!`)