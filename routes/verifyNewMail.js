const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const uniqid = require('uniqid');

// Verify Get handle
router.get('/:token', (req, res) => {
    var token = req.params.token;
    let errors = [];
    let success = [];

    if(!token){
        errors.push({msg: 'No token provided'});
        res.render('login', {errors});
    }
    else{
        var Token = uniqid() + uniqid();

        const sql1 = "SELECT * FROM users WHERE token = ?";
        connection.query(sql1, [
          token
        ], (err, result) => {
          if(err) throw err;

          if(!result.length){
            errors.push({msg: 'Invalid token'});
            res.render('login', {errors});
          }else{
            const sql2 = "UPDATE users SET email = ?, altEmail = '', token = ? WHERE email = ?";
            connection.query(sql2, [
              result[0].altEmail,
              Token,
              result[0].email
            ], (err, response) => {
                if(err) throw err;

                success.push({msg: 'Email address changed'});
                res.render('login', {success});
            })
          }
        });

        // client.connect((err, db) => {
        //     if(err) throw err;

        //     dbObj = client.db(dbname);

        //     dbObj.collection('users').find({token: token}).toArray((err, result) => {
        //         if(err) throw err;
        //         if(!result.length){
        //             errors.push({msg: 'Invalid token'});
        //             res.render('login', {errors});
        //         }
        //         else{
        //             //Changes verified from No to Yes, updates token as it was exposed
        //             dbObj.collection('users').updateOne({token: token}, {$set: {email: result[0].altEmail, altEmail: "", token: Token}}, (err, result) => {
        //                 if(err) throw err;

        //                 success.push({msg: 'Email address changed'});
        //                 res.render('login', {success});
        //             });
        //         }
        //     });
        // });
    }
});


module.exports = router;