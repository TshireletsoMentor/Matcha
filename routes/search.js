const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const connection = require('../config/connect');
const { session } = require('passport');

router.get('/', (req, res) => {

    session = req.session;

    if (!session.username){
        let errors = [];
        errors.push({ msg: 'You have to login to view this resource'});
        res.render('login', {errors});

    }else if(session.username == 'admin'){
      res.redirect('login');
    }
    else {
        res.render('search');
    }
});

router.get('/:page', (req, res) => {
    session = req.session;
    let perPage = 8;
    let page = req.params.page || 1;
    
})

router.post('/', (req, res) => { 

    session = req.session;
    let perPage = 8;
    let page = req.params.page || 1;

    let { age, interest1, interest2, interest3, interest4, location, popularity, filter } = req.body;
    let searchAge, searchInterest1, searchInterest2, searchInterest3, searchInterest4, searchPopularity, searchFilter;
    const sql1 = "SELECT * FROM users WHERE username = ?";
    connection.query(sql1, [
      session.username
    ], (err, result) => {
      if (err) throw err;

      gender = result[0].gender;
      sexOr = result[0].sexualOrientation;
      if (sexOr == 'Bi') {
        if (gender == 'Female')
          searchPref = "gender = 'Male' AND sexualOrientation IN ('Bi', 'Hetro') OR gender = 'Female' AND sexualOrientation IN ('Bi', 'Homo') "
          // searchPref = { $or: [ { $and: [ { gender : "Male" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Homo" } ] } ] };
        else if (gender == 'Male')
          searchPref = "gender = 'Male' AND sexualOrientation IN ('Bi', 'Homo') OR gender = 'Female' AND sexualOrientation IN ('Bi', 'Hetro') "
          // searchPref = { $or: [ { $and: [ { gender : "Female" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Homo" } ] } ] }; 
      }
      else if (sexOr == 'Hetro' && gender == 'Male') {
        searchPref = "gender = 'Female' AND sexualOrientation IN ('Hetro', 'Bi') " 
        // searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
      }
      else if (sexOr == 'Hetro' && gender == 'Female') {
        searchPref = "gender = 'Male' AND sexualOrientation IN ('Hetro', 'Bi') "  
        // searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
      }
      else if (sexOr == 'Homo' && gender == 'Male') {
        searchPref = "gender = 'Male' AND sexualOrientation = 'Homo' "  
        // searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
      }
      else if (sexOr == 'Homo' && gender == 'Female') {
        searchPref = "gender = 'Female' AND sexualOrientation = 'Homo' " 
        // searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
      }

    if (age) {
      //console.log(age)
        var startOfSearchAgeRange;
        var endOfSearchAgeRange;
         if(Array.isArray(age)) {
          // console.log("is age array")
            startOfSearchAgeRange = `${age[0]}`;
            if (startOfSearchAgeRange == 25)
                startOfSearchAgeRange = '18';
            else if (startOfSearchAgeRange == 35)
                startOfSearchAgeRange = '26';
            else if (startOfSearchAgeRange == 45)
                startOfSearchAgeRange = '36';
            else if (startOfSearchAgeRange == 55)
                startOfSearchAgeRange = '46';
            endOfSearchAgeRange = `${age[age.length - 1] - 0}`;
        }
        else {
          // console.log("is age str")
            if (age == 25) {
                startOfSearchAgeRange = `18`;
                endOfSearchAgeRange = `${age - 0}`;
            }
            else if (age != 56) {
                startOfSearchAgeRange = `${age - 9}`;
                endOfSearchAgeRange = `${age - 0}`;
            }
            else if (age == 56) {
                startOfSearchAgeRange = `${age - 0}`;
                endOfSearchAgeRange = `100`;
        }
      }
        if (startOfSearchAgeRange == 18 && endOfSearchAgeRange == 56)
                endOfSearchAgeRange = 100;

    //     searchAge = { age: { $gte: startOfSearchAgeRange , $lte: endOfSearchAgeRange } };
        searchAge = `AND age >= ${startOfSearchAgeRange} AND age <= ${endOfSearchAgeRange} `;
        // console.log(searchAge);
    }
    if (interest1) {
      // if(interest1 != 'Unchanged')
        searchInterest1 =  `AND interest1 = ${interest1} ` ;
    }
    if (interest2) {
      // if(interest2 != 'Unchanged')
        searchInterest2 = `AND interest2 = ${interest2} ` ;
    }
    if (interest3) {
      // console.log(interest3)
      // if(interest3 != 'Unchanged')
        searchInterest3 = `AND interest3 = ${interest3} ` ;
    }
    if (interest4) {
      // if(interest4 != 'Unchanged')
      // console.log(interest4)
        searchInterest4 = `AND interest4 = ${interest4} ` ;
    }
    if (location) {
        searchLocation = `AND (acos(sin(${result[0].lat}*PI()/180) * sin(users.lat*PI()/180) + cos(${result[0].lng}*PI()/180) * cos(users.lat*PI()/180) * cos(users.lng*PI()/180 - ${result[0].lng}*PI()/180))) * 6371 <= ${location} `;
    }
    if (popularity) {
        searchPopularity = `AND popularity = ${popularity} `;
    }
    if (filter) {
      if(filter == 'age'){
        searchFilter = 'ORDER BY age DESC';        
      }
      else if (filter == 'popularity'){
        searchFilter = 'ORDER BY popularity DESC';
      }
      else if (filter == 'location'){
        searchFilter = `ORDER BY (acos(sin(${result[0].lat}*PI()/180) * sin(users.lat*PI()/180) + cos(${result[0].lng}*PI()/180) * cos(users.lat*PI()/180) * cos(users.lng*PI()/180 - ${result[0].lng}*PI()/180))) * 6371`;
      }
      else if (filter == `tags`){
        searchFilter = `ORDER BY IF(interest1 = ${searchInterest1}, 1, 0) + IF(interest2 = ${searchInterest2}, 1, 0) + IF(interest3 = ${searchInterest3}, 1, 0) + IF(interest4 = ${searchInterest4}, 1, 0) DESC`;
      }
    }
    
    const sql2 = `SELECT * FROM users WHERE username NOT IN (SELECT blocked FROM blocked WHERE username = ?) AND ` + searchPref + `${searchAge ? searchAge : ''}` + `${searchInterest1 ? searchInterest1: ''}` + `${searchInterest2 ? searchInterest2 : ''}` + `${searchInterest3 ? searchInterest3 : ''}` + `${searchInterest4 ? searchInterest4 : ''}` + `${searchLocation ? searchLocation : ''}` + `${searchPopularity ? searchPopularity : ''}` + `${searchFilter ? searchFilter : ''}`;
    connection.query(sql2, [
      session.username
    ], (err, ret) => {
      if (err) throw err;


    })
        // setTimeout(() => {
        //     if (filter) {
        //         dbObj.collection("users").find(dbQuery).sort({[filter]: -1}).toArray(function(err, result){
        //             if (err) throw err;
        //             for (let i = 0; i < result.length; i++) {
        //                 if (geolib.getDistance({ latitude: currentUserLat, longitude: currentUserLng }, { latitude: result[i].location.lat, longitude: result[i].location.long }) > location *  1000)
        //                     result.splice(i, 1);
        //             }
        //             res.render('dashboard', { result });
        //         });
        //     }

        //     else {
        //         dbObj.collection("users").find(dbQuery).toArray(function(err, result){
        //             if (err) throw err;
        //             for (let i = 0; i < result.length; i++) {
        //                 if (geolib.getDistance({ latitude: currentUserLat, longitude: currentUserLng }, { latitude: result[i].location.lat, longitude: result[i].location.long }) > location *  1000)
        //                     result.splice(i, 1);
        //             }
        //             res.render('dashboard', { result });
        //         });
        //     }
        // }, 100);
  }) 
})

module.exports = router;