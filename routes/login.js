const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../config/connect');
const uniqid = require('uniqid');
const functions = require('../functions');
const geolib = require('geolib');

//login page

//Handle already logged in error
router.get('/', (req, res) => {
    
    session = req.session;
    let perPage = 8;
    let page = req.params.page || 1;

    if(session.username){
      if(session.username != 'admin'){
        const sql1 = "SELECT * FROM users WHERE username = ?";
        connection.query(sql1, [
          session.username
        ], (err, ret1) => {
          if (err) throw err;
          //console.log(ret1);
          if(ret1[0].extProfComp == 1){
            gender = ret1[0].gender;
            sexOr = ret1[0].sexualOrientation;
            interest1 = ret1[0].interest1;
            interest2 = ret1[0].interest2;
            interest3 = ret1[0].interest3;
            interest4 = ret1[0].interest4;
            currentUserLat = ret1[0].lat;
            currentUserLng = ret1[0].lng;
            if (sexOr == 'Bi') {
              if (gender == 'Female')
                searchPref = "gender = 'Male' AND sexualOrientation IN ('Bi', 'Hetro') OR gender = 'Female' AND sexualOrientation IN ('Bi', 'Homo')"
                // searchPref = { $or: [ { $and: [ { gender : "Male" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Homo" } ] } ] };
              else if (gender == 'Male')
                searchPref = "gender = 'Male' AND sexualOrientation IN ('Bi', 'Homo') OR gender = 'Female' AND sexualOrientation IN ('Bi', 'Hetro')"
                // searchPref = { $or: [ { $and: [ { gender : "Female" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Homo" } ] } ] }; 
            }
            else if (sexOr == 'Hetro' && gender == 'Male') {
              searchPref = "gender = 'Female' AND sexualOrientation IN ('Hetro', 'Bi')" 
              // searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
            }
            else if (sexOr == 'Hetro' && gender == 'Female') {
              searchPref = "gender = 'Male' AND sexualOrientation IN ('Hetro', 'Bi')"  
              // searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
            }
            else if (sexOr == 'Homo' && gender == 'Male') {
              searchPref = "gender = 'Male' AND sexualOrientation = 'Homo'"  
              // searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
            }
            else if (sexOr == 'Homo' && gender == 'Female') {
              searchPref = "gender = 'Female' AND sexualOrientation = 'Homo'" 
              // searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
            }
      
            const sql2 = "SELECT * FROM users WHERE username NOT IN (SELECT blocked FROM blocked WHERE username = ?) AND " + searchPref + " ORDER BY IF(interest1 = ?, 1, 0) + IF(interest2 = ?, 1, 0) + IF(interest3 = ?, 1, 0) + IF(interest4 = ?, 1, 0) DESC, popularity DESC";
              connection.query(sql2, [
              session.username,
              interest1,
              interest2,
              interest3,
              interest4
            ], (err, ret2) => {
              if (err) throw err;
      
              for (let i = 0; i < ret2.length; i++) {
                if (geolib.getDistance({ latitude: currentUserLat, longitude: currentUserLng }, { latitude: ret2[i].lat, longitude: ret2[i].lng }) > 50 * 1000)
                    ret2.splice(i, 1);
              }
              for (let i = 0; i < ret2.length; i++) {
                if (ret2[i].suspended != 0 || ret2[i].extProfComp == 0 || ret2[i].username == session.username){
                  ret2.splice(i, 1);                             
                }
              }
              //  console.log(ret2);
              let result = ret1;
      
              let ret = ret2.slice((perPage * page) - perPage, (perPage * page))
              console.log((perPage * page) - perPage);
              const sql3 = "SELECT * FROM likes WHERE liked = ?";
              connection.query(sql3, [
                session.username
              ], (err, like) => {
                if (err) throw err;
                //console.log(like)
                liked = [];
                for(let i = 0; i < ret.length; i++){
                  liked.push({username: ret[i].username.toLowerCase(),liked: false});
                  for(let j = 0; j < like.length; j++){
                    if(ret[i].username.toLowerCase() == like[j].username){
                      liked[i].liked = true;
                    }
                  }
                }
                //console.log(liked)
                //console.log(ret.length)
                res.render('dashboard', { result, ret, current: page, pages: Math.ceil(ret2.length / perPage), liked})                              
              })
            })
          } else {
            const sql2 = "SELECT COUNT(*) AS count FROM users WHERE username NOT IN (?, ?) AND suspended != 1 AND extProfComp != 0";

            connection.query(sql2, [
                'admin',
                 session.username
              ], (err, count) => {
                if (err) throw err;

                const sql3 = "SELECT * FROM users WHERE username NOT IN (?, ?) AND suspended != 1 AND extProfComp != 0 ORDER BY RAND() LIMIT ?, ?";

                connection.query(sql3, [
                  'admin',
                  session.username, 
                  (perPage * page) - perPage, 
                  perPage], (err, ret) => {
                    if (err) throw err;
                    
                    let result = ret1
                    
                    res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage)});
                });
            });
          }  
        });
      } else {
        const sql3 = "SELECT * FROM users WHERE username = ?";
        connection.query(sql3, [
          session.username
          ], (err, result) => {
            if (err) throw err;

            const sql4 = "SELECT COUNT(*) AS count FROM users WHERE online = 'Y'";
            connection.query(sql4, (err, count) => {
              if (err) throw err;
              const sql5 = "SELECT * FROM users WHERE username != 'admin' AND online = 'Y' AND suspended != 1 LIMIT ?, ?";
              connection.query(sql5, [
                (perPage * page) - perPage,
                perPage,
              ], (err, ret) => {
                if (err) throw err;
                res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage), count: count[0].count })
              })
            })
        });
      }
    }
      // let errors = [];
      // errors.push({msg: 'You have to logout to view this this page'});
      // client.connect((err, db) => {
      //     if(err) throw err;

      //     dbObj = client.db(dbname);

      //     dbObj.collection("users").find({}).toArray((err, result) => {
      //         if(err) throw err;

      //         res.render('dashboard', { result });
      //     })
      // });
    else{
      res.render('login');
    }
});

//Handle actual log in process
router.post('/', (req, res) => {
    const {username, password} = req.body;
    let perPage = 8;
    let page = req.params.page || 1;
    let errors = [];

    if(!username || !password){
        errors.push({msg: 'Please fill in both fields'});
    }

    if (!username.match(/^[A-Za-z0-9]+$/)){
        errors.push({msg: 'Invalid email, please try again'});
    }

    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)){
        errors.push({ msg: 'Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, and one number'})
    }

    if(errors.length > 0){
        res.render('login', {
            errors,
            username
        });
    }
    else{
      var Username = username.toLowerCase();
      const sql1 = "SELECT * FROM users WHERE username = ?";
      let searchPref = "";
      connection.query(sql1, [
        Username
        ], (err, result) => {
          if (err) throw err;

          if(result.length == 0){
            errors.push({msg: 'Invalid email or password'});
            res.render('login', {errors});
          }
          else if(bcrypt.compareSync(password, result[0].password) == false){
              errors.push({msg: 'Invalid email or password'});
              res.render('login', {errors});
          }
          else if (result[0].verified == 'N'){
              functions.sendMail(result[0].firstName, result[0].email, result[0].token);
              errors.push({msg: 'You need to verify your email, check your emails'});
              res.render('login', {errors});
          }
          else{
            let ViewToken = uniqid() + uniqid();
            const sql2 = "UPDATE users SET online = ?, viewToken = ? WHERE username = ?";
            connection.query(sql2, [
              'Y',
              ViewToken,
              Username
              ], (err, response) => {
                if(err) throw err;

                session = req.session;
                if(Username != "admin") {
                    session.username = Username;
                    session.email = result[0].email;
                    session.firstName = result[0].firstname;
                    session.objId = result[0].id;
                    session.extProfComp = result[0].extProfComp;
                    session.suspended = result[0].suspended;
                    session.profilePicture = result[0].profilePicture; 
                    session.query = '';
                    console.log(session)
                    //console.log(req);

                    setTimeout(() => {
                      const sql1 = "SELECT * FROM users WHERE username = ?";
                      connection.query(sql1, [
                        Username
                      ], (err, ret1) => {
                        if (err) throw err;
                        // console.log(ret1);
                        if (ret1[0].extProfComp == 1){
                          gender = ret1[0].gender;
                          sexOr = ret1[0].sexualOrientation;
                          interest1 = ret1[0].interest1;
                          interest2 = ret1[0].interest2;
                          interest3 = ret1[0].interest3;
                          interest4 = ret1[0].interest4;
                          currentUserLat = ret1[0].lat;
                          currentUserLng = ret1[0].lng;
                          if (sexOr == 'Bi') {
                            if (gender == 'Female')
                              searchPref = "gender = 'Male' AND sexualOrientation IN ('Bi', 'Hetro') OR gender = 'Female' AND sexualOrientation IN ('Bi', 'Homo')"
                              // searchPref = { $or: [ { $and: [ { gender : "Male" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Homo" } ] } ] };
                            else if (gender == 'Male')
                              searchPref = "gender = 'Male' AND sexualOrientation IN ('Bi', 'Homo') OR gender = 'Female' AND sexualOrientation IN ('Bi', 'Hetro')"
                              // searchPref = { $or: [ { $and: [ { gender : "Female" } , { sexualOrientation: "Hetro" } ] }, { $and: [ { gender: "Female" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Bi" } ] }, { $and: [ { gender: "Male" }, { sexualOrientation: "Homo" } ] } ] }; 
                          }
                          else if (sexOr == 'Hetro' && gender == 'Male') {
                            searchPref = "gender = 'Female' AND sexualOrientation IN ('Hetro', 'Bi')" 
                            // searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
                          }
                          else if (sexOr == 'Hetro' && gender == 'Female') {
                            searchPref = "gender = 'Male' AND sexualOrientation IN ('Hetro', 'Bi')"  
                            // searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Hetro" }, { sexualOrientation: "Bi" } ] } ] };
                          }
                          else if (sexOr == 'Homo' && gender == 'Male') {
                            searchPref = "gender = 'Male' AND sexualOrientation = 'Homo'"  
                            // searchPref = { $and: [ { gender: 'Male' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
                          }
                          else if (sexOr == 'Homo' && gender == 'Female') {
                            searchPref = "gender = 'Female' AND sexualOrientation = 'Homo'" 
                            // searchPref = { $and: [ { gender: 'Female' }, { $or: [ { sexualOrientation: "Homo" }, { sexualOrientation: "Bi" } ] } ] };
                          }
                    
                          const sql2 = "SELECT * FROM users WHERE username NOT IN (SELECT blocked FROM blocked WHERE username = ?) AND " + searchPref + " ORDER BY IF(interest1 = ?, 1, 0) + IF(interest2 = ?, 1, 0) + IF(interest3 = ?, 1, 0) + IF(interest4 = ?, 1, 0) DESC, popularity DESC";
                            connection.query(sql2, [
                            username,
                            interest1,
                            interest2,
                            interest3,
                            interest4
                          ], (err, ret2) => {
                            if (err) throw err;
                    
                            for (let i = 0; i < ret2.length; i++) {
                              if (geolib.getDistance({ latitude: currentUserLat, longitude: currentUserLng }, { latitude: ret2[i].lat, longitude: ret2[i].lng }) > 50 * 1000)
                                  ret2.splice(i, 1);
                            }
                            for (let i = 0; i < ret2.length; i++) {
                              if (ret2[i].suspended != 0 || ret2[i].extProfComp == 0 || ret2[i].username == Username){
                                ret2.splice(i, 1);                             
                              }
                            }
                            //  console.log(ret2);
                            let result = ret1;
                    
                            let ret = ret2.slice((perPage * page) - perPage, (perPage * page))
                            // console.log((perPage * page) - perPage);
                            const sql3 = "SELECT * FROM likes WHERE liked = ?";
                            connection.query(sql3, [
                              session.username
                            ], (err, like) => {
                              if (err) throw err;

                              liked = [];
                              for(let i = 0; i < ret.length; i++){
                                liked.push({username: ret[i].username.toLowerCase(),liked: false});
                                for(let j = 0; j < like.length; j++){
                                  if(ret[i].username.toLowerCase() == like[j].username){
                                    liked[i].liked = true;
                                  }
                                }
                              }
                              // console.log(liked)
                              res.render('dashboard', { result, ret, current: page, pages: Math.ceil(ret2.length / perPage), liked })                              
                            })
                          })
                        } else {
                          const sql2 = "SELECT COUNT(*) AS count FROM users WHERE username NOT IN (?, ?) AND suspended != 1 AND extProfComp != 0";
                          connection.query(sql2, [
                            'admin',
                            session.username
                          ], (err, count) => {
                            if (err) throw err;

                            const sql3 = "SELECT * FROM users WHERE username NOT IN (?, ?) AND suspended != 1 AND extProfComp != 0 ORDER BY RAND() LIMIT ?, ?";
                            connection.query(sql3, [
                              'admin',
                              session.username, 
                              (perPage * page) - perPage, 
                              perPage
                            ], (err, ret) => {
                              if (err) throw err;

                              res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage)});
                            });
                          }); 
                        }
                      })                      
                    }, 500);
                }else{
                  session.username = Username;
                  session.email = result[0].email;
                  session.objId = result[0].id;
                  session.extProfComp = result[0].extProfComp;
                  setTimeout(() => {
                    const sql4 = "SELECT COUNT(*) AS count FROM users WHERE online = 'Y'";
                    connection.query(sql4, (err, count) => {
                      if (err) throw err;
                      const sql5 = "SELECT * FROM users WHERE username != 'admin' AND online = 'Y' AND suspended != 1 LIMIT ?, ?";
                      connection.query(sql5, [
                        (perPage * page) - perPage,
                        perPage,
                      ], (err, ret) => {
                        if (err) throw err;
                        res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage), count: count[0].count })
                      })
                    })
                  }, 500);
                }
            });
          }
      });
    }
});


module.exports = router;
