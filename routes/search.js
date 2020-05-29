const express = require('express');
const router = express.Router();
const geolib = require('geolib');

router.get('/', (req, res) => {

    session = req.session;

    if (!session.objId){
        let errors = [];
        errors.push({ msg: 'You have to login to view this resource'});
        res.render('login', {errors});
    }
    else {
        res.render('search');
    }
});

router.post('/', (req, res) => {

    session = req.session;
    const { age, interest1, interest2, interest3, interest4, location, popularity, filter } = req.body;
    let currentUserLat, currentUserLng, sexOr, gender, searchAge, searchInterest1, searchInterest2, searchInterest3, searchInterest4, searchPopularity;
    if (age) {
        var startOfSearchAgeRange;
        var endOfSearchAgeRange;
        if (Array.isArray(age)) {
            startOfSearchAgeRange = age[0];
            if (startOfSearchAgeRange == 25)
                startOfSearchAgeRange = 18;
            else if (startOfSearchAgeRange == 35)
                startOfSearchAgeRange = 26;
            else if (startOfSearchAgeRange == 45)
                startOfSearchAgeRange = 36
            else if (startOfSearchAgeRange == 55)
                startOfSearchAgeRange = 46;
            endOfSearchAgeRange = age[age.length - 1] - 0;
        }
        else {
            if (age == 25) {
                startOfSearchAgeRange = 18;
                endOfSearchAgeRange = age - 0;
            }
            else if (age != 56) {
                startOfSearchAgeRange = age - 9;
                endOfSearchAgeRange = age - 0;
            }
            else if (age == 56) {
                startOfSearchAgeRange = age - 0;
                endOfSearchAgeRange = 100;
            }
        }
        if (startOfSearchAgeRange == 18 && endOfSearchAgeRange == 56)
                endOfSearchAgeRange = 100;

        searchAge = { age: { $gte: startOfSearchAgeRange , $lte: endOfSearchAgeRange } };
    }
    if (interest1) {
        searchInterest1 = { "interests.i1" : interest1 };
    }
    if (interest2) {
        searchInterest2 = { "interests.i2" : interest2 };
    }
    if (interest3) {
        searchInterest3 = { "interests.i3" : interest3 };
    }
    if (interest4) {
        searchInterest4 = { "interests.i4" : interest4 };
    }
    if (location) {

        dbObj.collection("users").find({"email": session.email}).toArray(function(err, result){
            if (err) throw err;
            currentUserLat = result[0].location.lat;
            currentUserLng = result[0].location.long;
        });
        // console.log(location);
    }
    if (popularity) {
        searchPopularity = { popularity : popularity - 0 };
    }
    if (filter) {
        // console.log(filter);
    }
    dbObj.collection("users").find({"email": session.email}).toArray(function(err, result){
        if (err) throw err;
        gender = result[0].gender;
        sexOr = result[0].sexualOrientation;
    
        if (sexOr == 'Bi') {
            if (gender == 'Female')
                searchPref = { $or: [ { $and: [ { gender : "Male" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Homo" } ] } ] };
            else if (gender == 'Male')
                searchPref = { $or: [ { $and: [ { gender : "Female" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Homo" } ] } ] }; 
        }
        else if (sexOr == 'Hetro' && gender == 'Male') {
            searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
        }
        else if (sexOr == 'Hetro' && gender == 'Female') {
            searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
        }
        else if (sexOr == 'Homo' && gender == 'Male') {
            searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
        }
        else if (sexOr == 'Homo' && gender == 'Female') {
            searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
        }
        let dbQuery = { $and: [] };
        dbQuery.$and.push(searchPref);
        // dbQuery.$and.push(searchPopularity);
        if (age)
            dbQuery.$and.push(searchAge);
        if (interest1 != 'Unchanged')
            dbQuery.$and.push(searchInterest1);
        if (interest2 != 'Unchanged')
            dbQuery.$and.push(searchInterest2);
        if (interest3 != 'Unchanged')
            dbQuery.$and.push(searchInterest3)
        if (interest4 != 'Unchanged')
            dbQuery.$and.push(searchInterest4);
        if (popularity != "0")
            dbQuery.$and.push(searchPopularity);
        console.log(dbQuery);
        setTimeout(() => {
            if (filter) {
                dbObj.collection("users").find(dbQuery).sort({[filter]: -1}).toArray(function(err, result){
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        if (geolib.getDistance({ latitude: currentUserLat, longitude: currentUserLng }, { latitude: result[i].location.lat, longitude: result[i].location.long }) > location *  1000)
                            result.splice(i, 1);
                    }
                    res.render('dashboard', { result });
                });
            }

            else {
                dbObj.collection("users").find(dbQuery).toArray(function(err, result){
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        if (geolib.getDistance({ latitude: currentUserLat, longitude: currentUserLng }, { latitude: result[i].location.lat, longitude: result[i].location.long }) > location *  1000)
                            result.splice(i, 1);
                    }
                    res.render('dashboard', { result });
                });
            }
        }, 100);

    });
})

module.exports = router;