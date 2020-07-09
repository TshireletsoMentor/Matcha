const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const functions = require("../functions");

//Handle already logged in error
router.get('/', (req, res) => {
    
    session = req.session;

    if(session.email){
        let errors = [];
        errors.push({msg: 'You have to logout to view this this page'});
        res.render('dashboard');
    }
    else{
        res.render('forgotPassword');
    }
});

router.post('/', (req, res) => {

    const {email} = req.body;
    let errors = [];
    let success = [];

    if(!email){
        errors.push({msg: 'Enter valid email address'});
        res.render('forgotPassword', {errors});
    }
    else{
        var Email = email.toLowerCase();

        const sql = "SELECT * FROM users WHERE email = ?";
        connection.query(sql, [
          Email
        ], (err, result) => {
          if (err) throw err;

          if(!result){
            success.push({msg: 'Email sent'});
          }
          else if(result[0].email == 'N'){
              functions.sendMail(result[0].firstname, result[0].email, result[0].token);
              success.push({msg: 'Email sent'});
          }
          else{
              functions.forgotMail(result[0].firstname, result[0].email, result[0].token);
              success.push({msg: 'Email sent'});
          }

          if(success){
              res.render('forgotPassword', {success})
          }          
        })

    }
});

module.exports = router;