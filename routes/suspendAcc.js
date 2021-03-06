const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

router.get('/', (req, res) => {
  let errors = [];
  session = req.session;

  if (!session.username){
    errors.push({ msg: "You have to login to view this resource."});
    res.render('login', {errors});
  }
  else if (session.username != "admin"){
      res.render('404');
  }
  else{
    res.redirect('login');
  }
});

router.get('/:userId', (req, res) => {
    var userId = req.params.userId;
    let errors = [];
    session = req.session;


    if (!session.username) {
      errors.push({ msg: "You have to login to view this resource."});
      res.render('login', {errors});
    }
    else if (session.username != "admin") {
        res.render('404');
    }
    else {
      const sql1 = "UPDATE users SET suspended = '1' WHERE id = ?";
      connection.query(sql1, [
        userId
      ], (err, response) => {
        if (err) throw err;
  
        const sql = "SELECT * FROM blocked WHERE processed = '0'";
        connection.query(sql, [], (err, result) => {
          if (err) throw err;
    
          res.render('blockReq', { result });
        })
      })
    }
});

module.exports = router;