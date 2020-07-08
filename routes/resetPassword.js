const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const bcrypt = require('bcrypt');
const functons = require('../functions');
const uniqid = require('uniqid');


router.get('/:token', (req, res) => {
    const token = req.params.token;
    let errors = [];
    let success = [];
    session = req.session;

    if(!token){
        errors.push({msg: 'No token provided, retry forgot password'});
        res.render('login', {errors});
    }

    const sql1 = "SELECT * FROM users WHERE token = ?";
    connection.query(sql1, [
      token
    ], (err, result) => {
      if (err) throw err;

      if(!result.length){
        errors.push({msg: 'Invalid token'});
        res.render('login', {errors});
      }
      else{
        session = req.session;
        session.email = result[0].email;
        console.log(session.email);
        res.render('resetPassword');
      }
    })

    // client.connect((err, db) => {
    //     dbObj = client.db(dbname);

    //     dbObj.collection("users").find({"token": token}).toArray((err, result) => {
    //         if(err) throw err;
    //         if(!result.length){
    //             errors.push({msg: 'Invalid token'});
    //             res.render('login', {errors});
    //         }
    //         else{
    //             session = req.session;
    //             session.email = result[0].email;
    //             console.log(session.email);
    //             res.render('resetPassword');
    //         }
    //     })
    // })
})

router.post('/', (req, res) => {
    session = req.session;
    //console.log(session.email)
    const {password, confirmpassword} = req.body;
    let errors = [];
    let success = [];
    var Token = uniqid() + uniqid();

    if(!password || !confirmpassword){
        errors.push({msg: 'Please fill in both fields'});
    }
    if(password !== confirmpassword){
        errors.push({msg: 'Passwords do not match'});
    }
    if(!password.match(/^(?=.*[0-9])(?=.*[!$%@#£€*?&])(?=.*[A-Za-z]).{8,}$/)){
        errors.push({msg: 'Password should be at least 8 characters, contain at least one uppercase or lowercase letter, at least one digit and at least one special character: !$%@#£€*?&'});
    }

    if(errors.length > 0){
        res.render('resetPassword', {errors})
    }
    else{
        var hash = bcrypt.hashSync(password, 10);
        const sql2 = "UPDATE users SET password = ?, token = ? WHERE email = ?";
        connection.query(sql2, [
          hash,
          Token,
          session.email
        ], (err, result) => {
          if (err) throw err;

          success.push({msg: 'Password succesfully reset'});
          res.render('login', {success});
        })

        // client.connect((err, db) => {
        //     if(err) throw err

        //     dbObj = client.db(dbname);
        //     var options = { "upsert": false };
        //     dbObj.collection("users").updateOne({"_id": session.email}, {$set: {password: hash, token: Token}}, (err, result) => {
        //         success.push({msg: 'Password succesfully reset'});
        //         res.render('login', {success});
        //     });

        // })
    }
})

module.exports = router;