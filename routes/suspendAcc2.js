const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

router.get('/', (req, res) => {
  let errors = [];
  session = req.session;
  let reportId = req.query.reportID;
  let userId = req.query.userID;

  if (!session.username){
    errors.push({ msg: "You have to login to view this resource."});
    res.render('login', {errors});
  }
  else if (session.username != "admin"){
      res.render('404');
  }
  else{
    if(userId && reportId){
      const sql1 = "UPDATE users SET suspended = '1' WHERE id = ?";
      connection.query(sql1, [
        userId
      ], (err, response) => {
        if (err) throw err;

        const sql = "UPDATE reports SET processed = '1' WHERE id = ?";
        connection.query(sql, [
          reportId
        ], (err, response) => {
          if (err) throw err;

          const sql = "SELECT * FROM reports WHERE processed = '0'";
          connection.query(sql, [], (err, ret) => {
            if (err) throw err;
    
            const sql2 = "SELECT * FROM users WHERE username = ?";
            connection.query(sql2, [
              ret[0].complainant
            ], (err, ret1) => {
              if (err) throw err;
    
              const sql3 = "SELECT * FROM users WHERE username = ?";
              connection.query(sql3, [
                ret[0].complaintAbout
              ], (err, ret2) => {
                if (err) throw err;
    
                res.render('reports', { ret, ret1, ret2 });
              })
            })
          })
        })
      });
    } else {
      const sql = "SELECT * FROM reports WHERE processed = '0'";
      connection.query(sql, [], (err, ret) => {
        if (err) throw err;

        const sql2 = "SELECT * FROM users WHERE username = ?";
        connection.query(sql2, [
          ret[0].complainant
        ], (err, ret1) => {
          if (err) throw err;

          const sql3 = "SELECT * FROM users WHERE username = ?";
          connection.query(sql3, [
            ret[0].complaintAbout
          ], (err, ret2) => {
            if (err) throw err;

            res.render('reports', { ret, ret1, ret2 });
          })
        })
      })
    }
  }
});


module.exports = router;