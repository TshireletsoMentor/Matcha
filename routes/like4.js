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
    let perPage = 8;
    let page = req.query.page || 1;
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
      });
      // if(session.query != ""){
      //   const sql1 = "SELECT * FROM users WHERE username = ?";
      //   connection.query(sql1, [
      //     session.username
      //   ], (err, result) => {
      //     if (err) throw err;
      //     setTimeout(() => {
      //       connection.query(session.query, [
      //         session.username
      //       ], (err, ret) => {
      //         if (err) throw err;
    
      //         ret.slice((perPage * page) - perPage, (perPage * page));
      //         //console.log(ret);
              
      //         res.render('search', { ret, current: page, pages: Math.ceil(ret.length / perPage) });
      //       })
      //     }, 200)
      //})
      res.redirect('back');
    }
})

module.exports = router;