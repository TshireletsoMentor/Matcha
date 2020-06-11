const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

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

        res.render('myLikes', { result });
      })
    }
    // dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
    //     if (err) throw err;
    //     dbObj.collection("users").find({}).toArray((err, ret) => {
    //         if (err) throw err;
    //         res.render('myLikes', { result, ret });
    //     });
    // }); 
});

module.exports = router;