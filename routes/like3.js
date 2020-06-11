const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const utilPop = require('../utilPop');

router.get('/', (req, res) => {
  session = req.session; 

  if (!session.username){
    let errors = [];
    errors.push({ msg: 'You have to login to view this resource'});
    res.render('login', {errors});
  }else if (session.username == 'admin') {
    res.redirect('login');
  } else {
    const sql = "SELECT * FROM users WHERE username IN (SELECT liked FROM likes WHERE username = ?) AND suspended != 1";
    connection.query(sql, [
      session.username
    ], (err, result) => {
      if (err) throw err;

      res.render('myMatches', { result });
    })
  }
})

router.get('/:viewToken', (req, res) => {
  let viewToken = req.params.viewToken;
  let errors = [];
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

      if (result[0].username != session.username && session.username != 'admin') {

        const sql3 = "DELETE FROM likes WHERE username = ? AND liked = ?";
        connection.query(sql3, [
          session.username,
          result[0].username  
        ], (err, response) => {
          if (err) throw err;

          utilPop.popularity(result[0].username);
        })
      }

      setTimeout(() => {
        const sql2 = "SELECT * FROM users WHERE username IN (SELECT liked FROM likes WHERE username = ?) AND suspended != 1";
        connection.query(sql2, [
          session.username
        ], (err, result) => {
          if (err) throw err;

          res.render('myMatches', { result });
        });
      }, 100)
    });
  }
})

module.exports = router; 