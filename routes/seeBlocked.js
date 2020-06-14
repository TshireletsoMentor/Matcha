const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const utilPop = require('../utilPop');

router.get('/', (req, res) => {
  session = req.session;

  if(!session.username){
    let errors = []
    errors.push({msg: 'You have to log in to view this resource'});
    res.render('login', {errors});
    
  } else if (session.username == 'admin'){
    res.redirect('login');

  } else {
    const sql = "SELECT * FROM users WHERE username IN (SELECT blocked FROM blocked WHERE username = ?)";
    connection.query(sql, [
      session.username,
    ], (err, result) => {
      if (err) throw err;

      res.render('seeBlocked', { result })
    })
  }
});

module.exports = router;
