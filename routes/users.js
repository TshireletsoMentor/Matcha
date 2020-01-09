const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const client = require('../config/connect');
const dbname = "Matcha";


//login page
router.get('/login', (req, res) => res.render('login'));

//register page

router.get('/register', (req, res) => res.render('register'));


//Handle registration inpu
router.post('/register', (req, res) => {
    console.log(req.body);
    const { username, firstname, lastname, email, password, confirmpassword } = req.body;
    var errors = [];

    //Check for empty fields
    if(!username || !firstname || !lastname || !email || !password | !confirmpassword){
        errors.push({msg: 'Please fill in all fields.'});
    }

    //Only alpha in names
    if(!firstname.match(/^[A-Za-z]+$/) || !lastname.match(/^[A-Za-z]+$/)){
        errors.push({msg: 'Names should only contain uppercase and lowercase letters.'});
    }

    //Check username for only alphanumerical
    if(!username.match(/^[A-Za-z0-9]+$/)){
        errors.push({msg: 'Username should only contain uppercase, lowercase letters and digits.'})
    }

    //Check for correct email
    if(!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        errors.push({msg: 'Invalid email, please try again'});
    }

    //Check confirm password
    if(password !== confirmpassword){
        errors.push({msg: 'Passwords do not match'});
    }

    //Check for password complexity
    if(!password.match(/^(?=.*[0-9])(?=.*[!$%@#£€*?&])(?=.*[A-Za-z]).{8,}$/)){
        errors.push({msg: 'Password should be at least 8 characters, contain at least one uppercase or lowercase letter, at least one digit and at least one special character: !$%@#£€*?&'});
    }

    //Render errors
    if(errors.length > 0){
        res.render('register', {
            errors,
            username,
            firstname,
            lastname,
            email
        });
    }
    else{
        //Registration validated
        var Hash = bcrypt.hashSync(password, 10);
        var Email = email.toLowerCase();
        var userObj = {
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: Email,
            password: Hash,
            verified:'N'
        };

        client.connect((err, db) => {

            if(err) throw err;
                console.log("Connected to mongodb...");

            var count = 1;

            dbObj = client.db(dbname);

            dbObj.collection("users").find({email: Email}).toArray(function(err, result){
                if(err) throw err;

                if(result.length > 0){
                    errors.push({msg: 'Email already in use, please use another'});
                }
            });

            dbObj.collection("users").find({username: username}).toArray(function(err, result){
                if(err) throw err;

                if(result.length > 0){
                    errors.push({msg: 'Username already in use, please use another'});
                    count++;
                    console.log(count);
                }
                if(count > 0){
                    console.log(errors);
                    res.render('register', {errors});
                }
                else{
                    dbObj.collection("users").insertOne(userObj, function(err, result) {
                    if (err) throw err;

                    let success = [];
                    success.push({msg: 'Registration successful! Please check your email to verufy your account'});
                    res.render('login', {success});
                    //res.redirect('login', {success});
                    });
                }
            });
        })
    }
});


module.exports = router;