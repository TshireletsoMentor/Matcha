const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const client = require('../config/connect');
const dbname = "Matcha";
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
        client.connect((err, db) => {
            if(err) throw err;

            dbObj = client.db(dbname);

            dbObj.collection('users').find({token: token}).toArray((err, result) => {
                if(err) throw err;
                if(!result.length){
                    errors.push({msg: 'Invalid token'});
                    res.render('login', {errors});
                }
                else{
                    //Changes verified from No to Yes, updates token as it was exposed
                    dbObj.collection('users').updateOne({token: token}, {$set: {email: result[0].altEmail, altEmail: "", token: Token}}, (err, result) => {
                        if(err) throw err;

                        success.push({msg: 'Email address changed'});
                        res.render('login', {success});
                    });
                }
            });
        });
    }
});


module.exports = router;