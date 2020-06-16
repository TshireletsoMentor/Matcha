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
    errors.push({msg: 'No report ID provided'});
    const sql = "SELECT * FROM blocked WHERE processed = '0'";
    connection.query(sql, [], (err, result) => {
      if (err) throw err;

      const sql1 = "SELECT * FROM users ";
      connection.query(sql1, [], (err, ret) => {
        if (err) throw err;

        res.render('blockReq', { result, ret, errors });
      })
    });
  }
});

router.get('/:blockReqId', (req, res) => {
  let blockReqId = req.params.blockReqId;
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
    const sql1 = "UPDATE blocked SET processed = '1' WHERE id = ?";
    connection.query(sql1, [
      blockReqId
    ], (err, response) => {
      if (err) throw err;

      const sql = "SELECT * FROM blocked WHERE processed = '0'";
      connection.query(sql, [], (err, result) => {
        if (err) throw err;
  
        res.render('blockReq', { result });
      })
    })
  }
})

module.exports = router;