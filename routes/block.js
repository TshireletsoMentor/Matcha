const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const utilPop = require('../utilPop');

router.get('/', (req, res) => {

    session = req.session;

    if (!session.username){
        let errors = [];
        errors.push({ msg: "You have to login to view this resource."});
        res.render('login', {errors});
    }
    else if (session.username != "admin"){
        res.render('404');
    }
    else{
      res.redirect('myMatches')
    


      // dbObj.collection("blockReq").find({}).toArray((err, ret) => {
      //     if(err) throw err;
      //     res.render('blockReq', {ret});
      // });
    }
});

router.get('/:viewToken', (req, res) => {
  let viewToken = req.params.viewToken;
  session = req.session;

  if (!session.username){
    let errors = [];
    errors.push({ msg: 'You have to login to view this resource'});
    res.render('login', {errors});
  } else {
    const sql = 'SELECT * FROM users WHERE viewToken = ?';
    connection.query(sql, [
      viewToken
    ], (err, result) => {
      if (err) throw err;
      if(result){
        const sql1 = "SELECT * FROM likes WHERE username = ? AND liked = ?";
        connection.query(sql1, [
          session.username,
          result[0].username
        ], (err, ret) => {
          if (err) throw err;
          // console.log(ret[0].username)
          if(ret){
            const sql2 = "INSERT INTO blocked (username, blocked, date) VALUES (?, ?, ?)";
            connection.query(sql2, [
              session.username,
              result[0].username,
              new Date()
            ], (err, response) => {
              if (err) throw err;
              // console.log(response)

              // console.log(result[0].username);
              const sql3 = "DELETE FROM likes WHERE username = ? AND liked = ?"
              connection.query(sql3, [
                session.username,
                result[0].username
              ], (err, response) => {
                if (err) throw err;
                // console.log(response)

                utilPop.popularity(result[0].username);

                const sql = "SELECT * FROM users WHERE username IN (SELECT liked FROM likes WHERE username = ? AND liked IN (SELECT username FROM likes WHERE liked = ?))";
                connection.query(sql, [
                  session.username,
                  session.username
                ], (err, result) => {
                  if (err) throw err;
          
                  res.render('myMatches', { result })
                })
              })
            })
          }else {
            res.redirect('myMatches');
          }
        })
      } else {
        res.redirect('myMatches');
      }
    })
  }
});

module.exports = router;