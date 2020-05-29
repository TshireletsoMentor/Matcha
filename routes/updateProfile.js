const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const bcrypt = require('bcrypt');
const functions = require('../functions');
const request = require('request');
const nodeGeocoder = require('node-geocoder');
require('dotenv').config();

router.get('/', (req, res) => {
    
    session = req.session;

    if(!session.email){
        let errors = [];
        errors.push({msg: 'You have to login to view this resource'});
        res.render('dashboard', {errors});
    }
    else{
        res.render('updateProfile');
    }
});

router.post('/', (req, res) => {
    
    session = req.session;
    var Mail = session.email;
    //console.log(req.body);

    const { username, firstname, lastname, email, gender, sexOr, dateOfBirth, location, Interest0, Interest1, Interest2, Interest3, password, confirmpassword, bio } = req.body;
    let errors = [];
    let success = [];
    if(username !== ""){
        if(!username.match(/^[A-Za-z0-9]+$/)){
            errors.push({msg: 'Usernames should only contain uppercase and lowercase letters and digits.'});
        }
    }
    
    if(firstname !== ""){
        if (!firstname.match(/^[A-Za-z]+$/)){
            errors.push({msg: 'Names can only include uppercase or lowercase letters'});
        }
    }

    if (lastname !== ''){
        if (!lastname.match(/^[A-Za-z]+$/)){
            errors.push({msg: 'Names can only include uppercase or lowercase letters'});
        }
    }

    // Check for valid email
    if (email !== ''){
        if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            errors.push({msg: 'Invalid email, please try again'});
        }
    }

    // Check passwords match
    if (password !== ''){
        if (password !== confirmpassword) {
            errors.push({ msg: 'Passwords do not match' });
        }
        
        //Check for password complexity
        if(!password.match(/^(?=.*[0-9])(?=.*[!$%@#£€*?&])(?=.*[A-Za-z]).{8,}$/)){
            errors.push({msg: 'Password should be at least 8 characters, contain at least one uppercase or lowercase letter, at least one digit and at least one special character: !$%@#£€*?&'});
        }
    }

    if(errors.length > 0){
        res.render('updateProfile', {
            errors,
            username,
            firstname,
            lastname,
            email
        });
    }

    //If errors array is empty create user object 
    if(errors.length == 0){
        if(password !== ""){
            var hash = bcrypt.hashSync(password, 10);
        }
        if(email !== ""){
            var Email = email.toLowerCase();
        }

        //console.log(req.body);

        client.connect((err, db) => {
            if(err) throw err;

            dbObj = client.db(dbname);

            if(username){
                dbObj.collection("users").find({"username": username}).toArray((err, result) => {
                    if(err) throw err;

                    if(result.length > 0){
                        errors.push({msg: 'Username already in use, please use another'});
                    }
                    else{
                        dbObj.collection('users').updateOne({"email": session.email}, {$set: {username: username}}, (err, result) => {
                            if(err) throw err;

                            session.username = username;
                            success.push({msg: 'Username updated successfully!'});
                        });
                    }
                });
            }

            if(firstname){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {firstname: firstname}}, (err, result) => {
                    if(err) throw err;

                    success.push({msg: 'Firstname updated successfully!'});
                })
            }

            if(lastname){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {lastname: lastname}}, (err, result) => {
                    if(err) throw err;

                    success.push({msg: 'Lastname updated successfully!'});
                })
            }

            if(Email){
                dbObj.collection("users").find({$or: [{"email": Email}, {"altEmail": Email}]}).toArray((err, result) => {
                    if(err) throw err;

                    if(result.length > 0){
                        errors.push({msg: 'Email already in use, please use another'});
                    }
                    else{
                        dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
                            if(err) throw err;

                            if(result.length !== 0){
                                var firstName = result[0].firstname;
                                var Token = result[0].token;
                                dbObj.collection('users').updateOne({"email": session.email}, {$set: {altEmail: Email}}, (err, result) => {
                                    if(err) throw err;
                                        
                                    functons.sendNewMail(firstName, Email, Token);
                                    success.push({msg: 'Email updated successfully, please verify your email'});
                                })
                            }
                            else{
                                errors.push({msg: 'Cant find this email in data base'});
                            }
                        })


                    }
                });
            }

            if(gender != 'Unchanged'){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {gender: gender}}, (err, result) => {
                    if(err) throw err;

                    success.push({msg: 'Gender updated successfully!'});
                })
            }

            if(sexOr != 'Unchanged'){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {sexualOrientation: sexOr}}, (err, result) => {
                    if(err) throw err;

                    success.push({msg: 'Sexual orientation updated successfully!'});
                })
            }

            if(dateOfBirth[0] != 2003){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {dateOfBirth: dateOfBirth, age: functions.age(dateOfBirth[0], dateOfBirth[1], dateOfBirth[2])}}, (err, result) => {
                    if(err) throw err;

                    success.push({msg: 'Date of birth updated successfully!'});
                })
            }

            
            if(location){
                var url = "https://geocoder.ls.hereapi.com/6.2/geocode.json?";
                var API = process.env.API;
                var searchText = location;
                searchText = searchText.replace(/[\s+\.,\\\/\(\)\*!@#$<>]/g, "%20");
                url = url + "searchtext=" + searchText + "&apiKey=" + API;

                //console.log(url);
                request({
                        url: url,
                        json: true,
                        }, (err, response, body) => {
                            if(!err && response.statusCode == 200){
                                var lat = body.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude;
                                var long = body.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude;
                                var city = body.Response.View[0].Result[0].Location.Address.City;
                                dbObj.collection("users").updateOne({"email": session.email}, {$set: {location: {city: city, lat: lat, long: long}}}, (err, result) => {
                                    if(err) throw err;

                                    console.log("Location manually updated")
                            })
                        }
                });
            }
                

            if(Interest0){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i1": Interest0}}, (err, result) => {
                    if(err) throw err;

                    if(!success.some(success => success.msg === "Interests updated successfully!")){
                        success.push({msg: 'Interests updated successfully!'});
                    }
                })
            }

            if(Interest1){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i2": Interest1}}, (err, result) => {
                    if(err) throw err;

                    if(!success.some(success => success.msg === "Interests updated successfully!")){
                    success.push({msg: 'Interests updated successfully!'});
                    }
                })
            }

            if(Interest2){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i3": Interest2}}, (err, result) => {
                    if(err) throw err;

                    if(!success.some(success => success.msg === "Interests updated successfully!")){
                        success.push({msg: 'Interests updated successfully!'});
                    }
                })
            }

            if(Interest3){
                dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i4": Interest3}}, (err, result) => {
                    if(err) throw err;

                    if(!success.some(success => success.msg === "Interests updated successfully!")){
                        success.push({msg: 'Interests updated successfully!'});
                    }
                })
            }

            if(bio){
                if(bio.length < 10000){
                    dbObj.collection('users').updateOne({"email": session.email}, {$set: {bio: bio}}, (err, result) => {
                        if(err) throw err;
    
                        success.push({msg: 'Biography updated successfully!'});
                    })
                }
                else{
                    errors.push({msg: 'Please keep your bio to less than 10,000 characters!'});
                }
            }

            if(hash){
                dbObj.collection("users").updateOne({"email": session.email}, {$set: {password: hash}}, (err, result) => {
                    if(err) throw err;

                    success.push({msg: 'Password updated successfully!'});
                });
            }
        
            //Render the successes
            //console.log(session.email);
            dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
                if(err) throw err;
                
                //console.log(result);
                //Update db for extended profile complete marker, if any of the properties in dbObj is empty, render 'incomplete profile'.
                //console.log(result[0]);
                if(result[0].username && result[0].firstname && result[0].lastname && result[0].email && result[0].password && result[0].gender && result[0].sexualOrientation && result[0].dateOfBirth && result[0].bio && result[0].interests.i1 && result[0].interests.i2 && result[0].interests.i3 && result[0].interests.i4){
                    if(result[0].location.city == "" && result[0].location.lat == "" && result[0].location.long == ""){
                        var URL = "https://www.ipapi.co/json";
                        request({
                                    url: URL,
                                    json: true,
                                    }, (err, response, body) => {
                                        if(!err && response.statusCode == 200){
                                            dbObj.collection("users").updateOne({"email": session.email}, {$set: {location: {city: body.city, lat: body.latitude, long: body.longitude}}}, (err, result) => {
                                                if(err) throw err;

                                                console.log("Auto location added");
                                            })
                                        }
                                });
                    }
                    dbObj.collection("users").updateOne({"email": session.email}, {$set: {extProfComp: 1}}, (err, result) => {
                        if(err) throw err;
                    })
                }
                else{
                    //console.log('here');
                    errors.push({msg: 'Profile is incomplete, please complete it before attempting to match'})
                }

                if(errors.length !== 0){
                    res.render('updateProfile', { errors });
                }else{
                    session.extProfComp = 1;
                    res.render('updateProfile', { success });
                }
            });
        });
        //console.log('Update success');
    }
});

module.exports = router