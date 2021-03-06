const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../config/connect');
const uniqid = require('uniqid');
const functons = require('../functions');

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

        sql = "SELECT * FROM users WHERE token = ?";
        connection.query(sql, [
          token
        ], (err, result) => {
          if (err) throw err;

          if(!result.length){
            errors.push({msg: 'Invalid token'});
            res.render('login', {errors});
          }
          else if(result[0].verified == 'Y'){
              errors.push({msg: 'Account already verified'});
              res.render('login', {errors});
          }else{
            sql1 = "UPDATE users SET verified = ?, token = ? WHERE token = ?";
            connection.query(sql1, [
              'Y',
              Token,
              token
            ], (err, result) => {
                if (err) throw err;
                success.push({msg: 'Account verified'});
                res.render('login', {success});
            })
          }
        })


        // client.connect((err, db) => {
        //     if(err) throw err;

        //     dbObj = client.db(dbname);

        //     dbObj.collection('users').find({token: token}).toArray((err, result) => {
        //         if(err) throw err;
        //         if(!result.length){
        //             errors.push({msg: 'Invalid token'});
        //             res.render('login', {errors});
        //         }
        //         else if(result[0].verified == 'Y'){
        //             errors.push({msg: 'Account already verified'});
        //             res.render('login', {errors});
        //         }
        //         else{
        //             //Changes verified from No to Yes, updates token as it was exposed
        //             dbObj.collection('users').updateOne({token: token}, {$set: {verified: 'Y', token: Token}}, (err, result) => {
        //                 if(err) throw err;
        //                 success.push({msg: 'Account verified'});
        //                 res.render('login', {success});
        //             });
        //         }
        //     });
        // });
    }
});


module.exports = router;