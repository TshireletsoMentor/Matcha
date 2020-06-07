const express = require('express');
const router = express.Router();
const connection= require('../config/connect');
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
        if(username){
          const sql1 = "SELECT * FROM users WHERE username = ?";
          connection.query(sql1, [
            username
          ], (err, result) => {
            if(err) throw err;

            if(result.length > 0){
                errors.push({msg: 'Username already in use, please use another'});
            }else{
              const sql2 = "UPDATE users SET username = ? WHERE email = ?";
              connection.query(sql2, [
                username,
                session.email
              ], (err, result) => {
                if(err) throw err;

                session.username = username;
                success.push({msg: 'Username updated successfully!'});
              })
            }
          })
        }
        if(firstname){
          const sql3 = "UPDATE users SET firstname = ? WHERE email = ?";
          connection.query(sql3, [
            firstname,
            session.email
          ], (err, result) => {
            if(err) throw err;

            success.push({msg: 'Firstname updated successfully!'});
          })
        }
        if(lastname){
          const sql4 = "UPDATE users SET lastname = ? WHERE email = ?";
          connection.query(sql4, [
            lastname,
            session.email
          ], (err, result) => {
            if(err) throw err;

            success.push({msg: 'Lastname updated successfully!'});
          })
        }
        if(lastname){
          const sql4 = "UPDATE users SET lastname = ? WHERE email = ?";
          connection.query(sql4, [
            lastname,
            session.email
          ], (err, result) => {
            if(err) throw err;

            success.push({msg: 'Lastname updated successfully!'});
          })
        }
        if(Email){
          const sql5 = "SELECT * FROM users WHERE email = ? or altEmail = ?";
          connection.query(sql5, [
            Email,
            Email
          ], (err, result) => {
            if (err) throw err

            if(result.length > 0){
              errors.push({msg: 'Email already in use, please use another'});

            }else{
              const sql6 = "SELECT * FROM users WHERE email = ?";
              connection.query(sql6, [
                session.email
              ], (err, result) => {
                if (err) throw err;

                if(result.length !== 0){
                  var firstName = result[0].firstname;
                  var Token = result[0].token;

                  const sql7 = "UPDATE users SET altEmail = ? WHERE email = ?"
                  connection.query(sql7, [
                    Email,
                    session.email
                  ], (err, result) => {
                    if(err) throw err;
                                        
                    functons.sendNewMail(firstName, Email, Token);
                    success.push({msg: 'Email updated successfully, please verify your email'});
                  })
                }else{
                  errors.push({msg: 'Cant find this email in data base'});
                }
              })
            }
          })
        }
        if(gender != 'Unchanged'){
          const sql8 = "UPDATE users SET gender = ? WHERE email = ?";
          connection.query(sql8, [
            gender,
            session.email
          ], (err, result) => {
            if(err) throw err;

            success.push({msg: 'Gender updated successfully!'});
          })
        }
        if(sexOr != 'Unchanged'){
          const sql9 = "UPDATE users SET sexualOrientation = ? WHERE email = ?";
          connection.query(sql9, [
            sexOr,
            session.email
          ], (err, result) => {
            if(err) throw err;

            success.push({msg: 'Sexual orientation updated successfully!'});
          })
        }
        if(dateOfBirth){
          let year = new Date(dateOfBirth).getFullYear();
          let month = new Date(dateOfBirth).getMonth();
          let day = new Date(dateOfBirth).getDay();
          if(year > 1920 && year < 2003){
            let Age = functions.age(year, month, day)
            const sql9 = "UPDATE users SET dateOfBirth = ?, age = ? WHERE email = ?";
            connection.query(sql9, [
              dateOfBirth,
              Age,
              session.email
            ], (err, result) => {
              if(err) throw err;
  
              success.push({msg: 'Date of birth updated successfully!'});
            })
          }else if (year < 1920){
            errors.push({msg: 'Please enter your real age, Dumbledore.'});
          }else{
            errors.push({msg: 'The age restriction for this application is 18+, please refrain from using this application if otherwise!'});
          }
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
                        const sql10 = "UPDATE users SET city = ?, lat = ?, lng = ? WHERE email = ?";
                        connection.query(sql10, [
                          city,
                          lat,
                          long,
                          session.email
                        ], (err, result) => {
                          if(err) throw err;

                        })
                  }
          });
          success.push({msg: 'Location updated successfully!'});
        }
        if(Interest0){
          const sql11 = "UPDATE users SET interest1 = ? WHERE email = ?";
          connection.query(sql11, [
            Interest0,
            session.email
          ], (err, result) => {
            if(err) throw err;

            if(!success.some(success => success.msg === "Interests updated successfully!")){
                success.push({msg: 'Interests updated successfully!'});
            }
          })
        }
        if(Interest1){
          const sql12 = "UPDATE users SET interest2 = ? WHERE email = ?";
          connection.query(sql12, [
            Interest1,
            session.email
          ], (err, result) => {
            if(err) throw err;

            if(!success.some(success => success.msg === "Interests updated successfully!")){
                success.push({msg: 'Interests updated successfully!'});
            }
          })
        }
        if(Interest2){
          const sql13 = "UPDATE users SET interest3 = ? WHERE email = ?";
          connection.query(sql13, [
            Interest2,
            session.email
          ], (err, result) => {
            if(err) throw err;

            if(!success.some(success => success.msg === "Interests updated successfully!")){
                success.push({msg: 'Interests updated successfully!'});
            }
          })
        }
        if(Interest3){
          const sql14 = "UPDATE users SET interest4 = ? WHERE email = ?";
          connection.query(sql14, [
            Interest3,
            session.email
          ], (err, result) => {
            if(err) throw err;

            if(!success.some(success => success.msg === "Interests updated successfully!")){
                success.push({msg: 'Interests updated successfully!'});
            }
          })
        }
        if(bio){
          if(bio.length < 10000){
            const sql15 = "UPDATE users SET bio = ? WHERE email = ?";
            connection.query(sql15, [
              bio,
              session.email
            ], (err, result) => {
              if(err) throw err;

              success.push({msg: 'Biography updated successfully!'});
            })
          }
          else{
              errors.push({msg: 'Please keep your bio to less than 10,000 characters!'});
          }
        }
        if(hash){
          const sql16 = "UPDATE users SET password = ? WHERE email = ?"
          connection.query(sql16, [
            hash, session.email
          ], (err, result) => {
            if(err) throw err;

            success.push({msg: 'Password updated successfully!'});
          })
        }

        const sql17 = "SELECT * FROM users WHERE email = ?";
        connection.query(sql17, [
          session.email
        ], (err, result) => {
         if(err) throw err;
          
          //console.log(result);
          //Update db for extended profile complete marker, if any of the properties in dbObj is empty, render 'incomplete profile'.
          //console.log(result[0]);
          if(result[0].username && result[0].firstname && result[0].lastname && result[0].email && result[0].password && result[0].gender && result[0].sexualOrientation && result[0].dateOfBirth && result[0].bio && result[0].interest1 && result[0].interest2 && result[0].interest3 && result[0].interest4){
            if(result[0].city == "" && result[0].lat == "" && result[0].lng == ""){
                  var URL = "https://www.ipapi.co/json";
                  request({
                    url: URL,
                    json: true,
                    }, (err, response, body) => {
                        if(!err && response.statusCode == 200){
                          const sql18 = "UPDATE users SET city = ?, lat = ?, lng = ? WHERE email = ?";
                          connection.query(sql18, [
                            body.city,
                            body.latitude,
                            body.longitude
                          ], (err, result) => {
                            if(err) throw err;

                            console.log("Auto location added");
                          })
                        }
                  });
              }
              const sql19 = "UPDATE users SET extProfComp = ? WHERE email = ?";
              connection.query(sql19, [
                1,
                session.email
              ], (err, result) => {
                if (err) throw err;
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
    }
});

module.exports = router


//

        // client.connect((err, db) => {
        //     if(err) throw err;

        //     dbObj = client.db(dbname);

        //     if(username){
        //         dbObj.collection("users").find({"username": username}).toArray((err, result) => {
        //             if(err) throw err;

        //             if(result.length > 0){
        //                 errors.push({msg: 'Username already in use, please use another'});
        //             }
        //             else{
        //                 dbObj.collection('users').updateOne({"email": session.email}, {$set: {username: username}}, (err, result) => {
        //                     if(err) throw err;

        //                     session.username = username;
        //                     success.push({msg: 'Username updated successfully!'});
        //                 });
        //             }
        //         });
        //     }

        //     if(firstname){
        //         dbObj.collection('users').updateOne({"email": session.email}, {$set: {firstname: firstname}}, (err, result) => {
        //             if(err) throw err;

        //             success.push({msg: 'Firstname updated successfully!'});
        //         })
        //     }

        //     if(lastname){
        //         dbObj.collection('users').updateOne({"email": session.email}, {$set: {lastname: lastname}}, (err, result) => {
        //             if(err) throw err;

        //             success.push({msg: 'Lastname updated successfully!'});
        //         })
        //     }

            // if(Email){
            //     dbObj.collection("users").find({$or: [{"email": Email}, {"altEmail": Email}]}).toArray((err, result) => {
            //         if(err) throw err;

            //         if(result.length > 0){
            //             errors.push({msg: 'Email already in use, please use another'});
            //         }
            //         else{
            //             dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
            //                 if(err) throw err;

            //                 if(result.length !== 0){
            //                     var firstName = result[0].firstname;
            //                     var Token = result[0].token;
            //                     dbObj.collection('users').updateOne({"email": session.email}, {$set: {altEmail: Email}}, (err, result) => {
            //                         if(err) throw err;
                                        
            //                         functons.sendNewMail(firstName, Email, Token);
            //                         success.push({msg: 'Email updated successfully, please verify your email'});
            //                     })
            //                 }
            //                 else{
            //                     errors.push({msg: 'Cant find this email in data base'});
            //                 }
            //             })


            //         }
            //     });
            // }


            // if(gender != 'Unchanged'){
            //     dbObj.collection('users').updateOne({"email": session.email}, {$set: {gender: gender}}, (err, result) => {
            //         if(err) throw err;

            //         success.push({msg: 'Gender updated successfully!'});
            //     })
            // }

            // if(sexOr != 'Unchanged'){
            //     dbObj.collection('users').updateOne({"email": session.email}, {$set: {sexualOrientation: sexOr}}, (err, result) => {
            //         if(err) throw err;

            //         success.push({msg: 'Sexual orientation updated successfully!'});
            //     })
            // }

            // if(dateOfBirth[0] != 2003){
            //     dbObj.collection('users').updateOne({"email": session.email}, {$set: {dateOfBirth: dateOfBirth, age: functions.age(dateOfBirth[0], dateOfBirth[1], dateOfBirth[2])}}, (err, result) => {
            //         if(err) throw err;

            //         success.push({msg: 'Date of birth updated successfully!'});
            //     })
            // }

            
            // if(location){
            //     var url = "https://geocoder.ls.hereapi.com/6.2/geocode.json?";
            //     var API = process.env.API;
            //     var searchText = location;
            //     searchText = searchText.replace(/[\s+\.,\\\/\(\)\*!@#$<>]/g, "%20");
            //     url = url + "searchtext=" + searchText + "&apiKey=" + API;

            //     //console.log(url);
            //     request({
            //             url: url,
            //             json: true,
            //             }, (err, response, body) => {
            //                 if(!err && response.statusCode == 200){
            //                     var lat = body.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude;
            //                     var long = body.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude;
            //                     var city = body.Response.View[0].Result[0].Location.Address.City;
            //                     dbObj.collection("users").updateOne({"email": session.email}, {$set: {location: {city: city, lat: lat, long: long}}}, (err, result) => {
            //                         if(err) throw err;

            //                         console.log("Location manually updated")
            //                 })
            //             }
            //     });
            // }
                

            // if(Interest0){
            //     dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i1": Interest0}}, (err, result) => {
            //         if(err) throw err;

            //         if(!success.some(success => success.msg === "Interests updated successfully!")){
            //             success.push({msg: 'Interests updated successfully!'});
            //         }
            //     })
            // }

            // if(Interest1){
            //     dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i2": Interest1}}, (err, result) => {
            //         if(err) throw err;

            //         if(!success.some(success => success.msg === "Interests updated successfully!")){
            //         success.push({msg: 'Interests updated successfully!'});
            //         }
            //     })
            // }

            // if(Interest2){
            //     dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i3": Interest2}}, (err, result) => {
            //         if(err) throw err;

            //         if(!success.some(success => success.msg === "Interests updated successfully!")){
            //             success.push({msg: 'Interests updated successfully!'});
            //         }
            //     })
            // }

            // if(Interest3){
            //     dbObj.collection('users').updateOne({"email": session.email}, {$set: {"interests.i4": Interest3}}, (err, result) => {
            //         if(err) throw err;

            //         if(!success.some(success => success.msg === "Interests updated successfully!")){
            //             success.push({msg: 'Interests updated successfully!'});
            //         }
            //     })
            // }

            // if(bio){
            //     if(bio.length < 10000){
            //         dbObj.collection('users').updateOne({"email": session.email}, {$set: {bio: bio}}, (err, result) => {
            //             if(err) throw err;
    
            //             success.push({msg: 'Biography updated successfully!'});
            //         })
            //     }
            //     else{
            //         errors.push({msg: 'Please keep your bio to less than 10,000 characters!'});
            //     }
            // }

            // if(hash){
            //     dbObj.collection("users").updateOne({"email": session.email}, {$set: {password: hash}}, (err, result) => {
            //         if(err) throw err;

            //         success.push({msg: 'Password updated successfully!'});
            //     });
            // }
        
            //Render the successes
            //console.log(session.email);
            // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
            //     if(err) throw err;
                
            //     //console.log(result);
            //     //Update db for extended profile complete marker, if any of the properties in dbObj is empty, render 'incomplete profile'.
            //     //console.log(result[0]);
            //     if(result[0].username && result[0].firstname && result[0].lastname && result[0].email && result[0].password && result[0].gender && result[0].sexualOrientation && result[0].dateOfBirth && result[0].bio && result[0].interests.i1 && result[0].interests.i2 && result[0].interests.i3 && result[0].interests.i4){
            //         if(result[0].location.city == "" && result[0].location.lat == "" && result[0].location.long == ""){
            //             var URL = "https://www.ipapi.co/json";
            //             request({
            //                         url: URL,
            //                         json: true,
            //                         }, (err, response, body) => {
            //                             if(!err && response.statusCode == 200){
            //                                 dbObj.collection("users").updateOne({"email": session.email}, {$set: {location: {city: body.city, lat: body.latitude, long: body.longitude}}}, (err, result) => {
            //                                     if(err) throw err;

            //                                     console.log("Auto location added");
            //                                 })
            //                             }
            //                     });
            //         }
            //         dbObj.collection("users").updateOne({"email": session.email}, {$set: {extProfComp: 1}}, (err, result) => {
            //             if(err) throw err;
            //         })
            //     }
            //     else{
            //         //console.log('here');
            //         errors.push({msg: 'Profile is incomplete, please complete it before attempting to match'})
            //     }

            //     if(errors.length !== 0){
            //         res.render('updateProfile', { errors });
            //     }else{
            //         session.extProfComp = 1;
            //         res.render('updateProfile', { success });
            //     }
            // });
        //});
        //console.log('Update success');
