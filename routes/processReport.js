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

router.get('/:reportId', (req, res) => {
    var reportId = req.params.reportId;
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
      const sql = "UPDATE reports SET processed = '1' WHERE id = ?";
      connection.query(sql, [
        reportId
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