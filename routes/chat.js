const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const moment = require('moment');

router.get('/', (req, res) => {
    session = req.session;

    if (!session.username){
      let errors = [];
      errors.push({ msg: "You have to login to view this resource."});
      res.render('login', {errors});
    }
    else if(session.username == 'admin'){
      res.redirect('login');
    }
    else{
      const sql = "SELECT * FROM users WHERE username IN (SELECT liked FROM likes WHERE username = ? AND liked IN (SELECT username FROM likes WHERE liked = ?))";
      connection.query(sql, [
        session.username,
        session.username
      ], (err, result) => {
        if (err) throw err;

        res.render('chatBoard', { result })
      })
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
    const sql1 = "SELECT * FROM users WHERE viewToken = ?";
    connection.query(sql1, [
      viewToken
    ], (err, ret) => {
      if (err) throw err;

      if(ret.length == 1){
        if (ret[0].username != session.username && session.username != 'admin') {
          const sql2 = "SELECT * FROM likes WHERE username = ? AND liked = ?";
          connection.query(sql2, [
            session.username,
            ret[0].username
          ], (err, liked) => {
            if (err) throw err;

            if(liked.length == 1){
              const sql3 = "SELECT * FROM chats WHERE sender = ? and receiver = ?";
              connection.query(sql3, [
                session.username,
                ret[0].username
              ], (err, result) => {
                if (err) throw err;

                  res.render('chat', {ret, result})
              });
            }
          })
        }
      }
    })
  }
});

// router.post('/', (req, res) => {
//   session = req.session;
  
//   console.log(req.body);

//   const {viewToken, message} = req.body;

//   if (!session.username){
//     let errors = [];
//     errors.push({ msg: "You have to login to view this resource."});
//     res.render('login', {errors});
//   }
//   else if(session.username == 'admin'){
//     res.redirect('login');
//   }
//   else{
//     console.log(message)
//     res.status(200).redirect('chat');
//   }
// });

module.exports = router;