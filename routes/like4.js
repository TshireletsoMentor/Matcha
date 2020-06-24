const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const utilPop = require('../utilPop');
const geolib = require('geolib');


router.get('/', (req, res) => {
    let errors = [];
    session = req.session;

    if (session.email){
      res.redirect('login');
      // errors.push({msg: "No reference account provided!"});
      // let perPage = 8;
      // let page = req.params.page || 1;
      
      // const sql1 = "SELECT * FROM users WHERE email = ?";
      // connection.query(sql1, [
      //   session.email
      // ], (err, result) => {
      //   if (err) throw err;
        
      //   if (session.username == 'admin'){
      //     var sqlY = "SELECT COUNT(*) AS count FROM users WHERE online = 'Y'";
      //   }else{
      //     var sqlY = "SELECT COUNT(*) AS count FROM users"
      //   }
      //   connection.query(sqlY, (err, count) => {
      //     if (err) throw err;
      //     const sql5 = "SELECT * FROM users LIMIT ?, ?";
      //     connection.query(sql5, [
      //       (perPage * page) - perPage,
      //       perPage,
      //     ], (err, ret) => {
      //       if (err) throw err;
      //       res.render('dashboard', { errors, result, ret, current: page, pages: Math.ceil(count[0].count / perPage), count: count[0].count });
      //     })
      //   })
      // })
    }else{
      res.render('login');
    }



    // errors.push({msg: 'No reference provided!'});
    // dbObj.collection("users").find({}).toArray((err, result) => {
    //     if(err) throw err;
    //     res.render('dashboard', { result, errors });
    // })
})

router.get('/:viewToken', (req, res) => {
    let viewToken = req.params.viewToken;
    let errors = [];
    let views = 0;
    session = req.session;

    if (!session.username){
        let errors = [];
        errors.push({ msg: 'You have to login to view this resource'});
        res.render('login', {errors});
    }
    else {
      const sql1 = "SELECT * FROM users WHERE viewToken = ?";
      connection.query(sql1, [
        viewToken
      ], (err, result) => {
        if (err) throw err;

        if(result.length == 1){

          if (result[0].username != session.username && session.username != 'admin') {
            const sql2 = "SELECT * FROM likes WHERE username = ? AND liked = ?";
            connection.query(sql2, [
              session.username,
              result[0].username
            ], (err, liked) => {
              if (err) throw err;

              if(liked.length == 0){
                const sql3 = "INSERT INTO likes (username, liked) VALUES (?, ?)";
                connection.query(sql3, [
                  session.username,
                  result[0].username
                ], (err, response) => {
                  if (err) throw err;

                  utilPop.popularity(result[0].username);
                })
              }
            })
          }
        }
      })
      setTimeout(() => {
        let perPage = 8;
        let page = req.params.page || 1;
        
        if(session.username){
          if(session.username != 'admin'){
            const sql1 = "SELECT * FROM users WHERE username = ?";
            connection.query(sql1, [
              session.username
            ], (err, ret1) => {
              if (err) throw err;
              // console.log(ret1);
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
        
                ret2.slice((perPage * page) - perPage, (perPage * page))
                let ret = ret2;
                // console.log((perPage * page) - perPage);
                
                res.render('dashboard', { result, ret, current: page, pages: Math.ceil(ret2.length / perPage) })
              })
            }) 
          } else {
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
          }
        }
      }, 100) 

    }
})

module.exports = router;