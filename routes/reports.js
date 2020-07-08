const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const func = require('../functions');

router.get('/', (req, res) => {

    session = req.session;

    if(!session.username){
        let errors = [];
        errors.push({ msg: "You have to login to view this resource."});
        res.render('login', {errors});
    }
    else if (session.username != "admin"){
        res.render('404');
    }
    else{
      const sql = "SELECT * FROM reports WHERE processed = '0'";
      connection.query(sql, [], (err, ret) => {
        if (err) throw err;

        if(ret.length > 0){
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
        } else {
          ret = []
          res.render('reports', { ret });
        }
      })
        // dbObj.collection("reports").find({}).toArray((err, ret) => {
        //     if (err) throw err;
        //     res.render('reports', { ret })
        // });
    }
});

module.exports = router;