const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const functions = require('../functions');

router.get('/', (req, res) => {
    
    session = req.session;

    if(!session.email){
        let errors = [];
        errors.push({msg: "You have to login to view this resource"});
        res.render('login', {errors});
    }
    else{
      const sql = "SELECT * FROM users WHERE email = ?";
      connection.query(sql, [
        session.email
      ], (err, result) => {
        if(err) throw err;

        var age = functions.age(result[0].dateOfBirth)
        res.render('myProfile', {result, age});
      })

      // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
      //     if(err) throw err;

      //     var age = functions.age(result[0].dateOfBirth[0], result[0].dateOfBirth[1], result[0].dateOfBirth[2])
      //     res.render('myProfile', {result, age});
      // })
    }
})


module.exports = router;