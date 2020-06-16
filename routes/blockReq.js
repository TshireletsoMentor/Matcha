const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

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
      const sql = "SELECT * FROM blocked WHERE processed = '0'";
      connection.query(sql, [], (err, result) => {
        if (err) throw err;

        res.render('blockReq', { result });
      });
      // dbObj.collection("blocked").find({}).toArray((err, ret) => {
      //     if(err) throw err;
      //     res.render('blockReq', {ret});
      // });
    }
});

module.exports = router;