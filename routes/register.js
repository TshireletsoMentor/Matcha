const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../config/connect');
const uniqid = require('uniqid');
const functons = require('../functions');


//register page

router.get('/', (req, res) => {
    
    //console.log(req.session);
    session = req.session;

    if(session.email){
        //let errors = [];
        //errors.push({msg: 'You have to logout to view this this page'});
        const sql = "SELECT * FROM users";
        connection.query(sql, (err, result) => {
          if (err) throw err;

          res.render('dashboard', { result })
        });

        // client.connect((err, db) => {
        //     if(err) throw err;

        //     dbObj = client.db(dbname);

        //     dbObj.collection("users").find({}).toArray((err, result) => {
        //         if(err) throw err;

        //         res.render('dashboard', { result });
        //     })
        // });
    }
    else{
         res.render('register');
    }
});


//Handle registration input
router.post('/', (req, res) => {
    //console.log(req.body);
    //str = JSON.parse(JSON.stringify(req.body));

    // for(var key in str) {
    //     if(str.hasOwnProperty(key)){
    //       //do something with e.g. req.body[key]
    //         function htmlEntities(str) {
    //             return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    //         }
    //     }
    // }
    //console.log(str);
    const { username, firstname, lastname, email, password, confirmpassword } = req.body;
    var errors = [];

    //Check for empty fields
    if(!username || !firstname || !lastname || !email || !password | !confirmpassword){
        errors.push({msg: 'Please fill in all fields.'});
    }

    //Only alpha in names
    if(!firstname.match(/^[A-Za-z]+$/) || !lastname.match(/^[A-Za-z]+$/) || !username.match(/^[A-Za-z0-9]+$/)){
        errors.push({msg: 'Names should only contain uppercase and lowercase letters.'});
    }

    //Check username for only alphanumerical
    // if(!username.match(/^[A-Za-z0-9]+$/)){
    //     errors.push({msg: 'Username should only contain uppercase, lowercase letters and digits.'})
    // }

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
        var Token = uniqid() + uniqid();
        var ViewToken = uniqid() + uniqid();
        var Username = username.toLowerCase();

        var sql = "SELECT * FROM users WHERE username = ? OR email = ?";
        connection.query(sql, [
          Username,
          Email
        ], (err, result) => {
          if (err) throw err;

          if(result.length > 0){
            let i = 0;
            while(result[i]){
                if(result[i].email == Email){
                    errors.push({msg: 'Email already in use, please use another'});
                }
                if(result[i].username == Username){
                    errors.push({msg: 'Username already in use, please use another'});
                }
                i++;
            }
            res.render('register', {
                errors,
                username,
                firstname,
                lastname,
                email
            });
          }else{
            var sql1 = "INSERT INTO users (username, firstname, lastname, email, altEmail, password, token, viewToken, verified, bio) VALUES ?";
            let userArray = [];
            let userArrayObject = [
              Username,
              firstname,
              lastname,
              Email,
              "",
              Hash,
              Token,
              ViewToken,
              "N",
              ""
            ];
            userArray.push(userArrayObject);
            let success = [];
            connection.query(sql1, [userArray], (err, result) => {
              if (err) throw err;
              console.log(result);
              functons.sendMail(firstname, Email, Token);
              success.push({msg: 'Registration successful! Please check your email to verify your account'});
              res.render('login', {success});
            });
          }
        })

        // var userObj = {
        //     username: Username,
        //     firstname: firstname,
        //     lastname: lastname,
        //     email: Email,
        //     altEmail: "",
        //     password: Hash,
        //     token: Token,
        //     viewToken: ViewToken,
        //     verified:'N',
        //     gender: "",
        //     sexualOrientation: "",
        //     dateOfBirth: [],
        //     age: "",
        //     bio: "",
        //     interests: 
        //     {
        //         i1: "",
        //         i2: "",
        //         i3: "",
        //         i4: ""
        //     },
        //     location: 
        //     {
        //         city: "",
        //         lat: "",
        //         long: ""
        //     },
        //     popularity: 5,
        //     profilePicture: "",
        //     pic1: "",
        //     pic2: "",
        //     pic3: "",
        //     pic4: "",
        //     online: "N",
        //     lastOn: "",
        //     suspended: 0,
        //     blocked: [],
        //     likedBy: [],
        //     myLikes: [],
        //     profileViews: [],
        //     extProfComp: 0
        // };

        // client.connect((err, db) => {

        //     if(err) throw err;
        //         console.log("Connected to mongodb...");

        //     dbObj = client.db(dbname);

        //     dbObj.collection("users").find({ "$or": [{"username": Username}, {"email": Email}]}).toArray(function(err, result){
        //         if(err) throw err;

        //         if(result.length > 0){
        //             let i = 0;
        //             while(result[i]){
        //                 if(result[i].email == Email){
        //                     errors.push({msg: 'Email already in use, please use another'});
        //                 }
        //                 if(result[i].username == Username){
        //                     errors.push({msg: 'Username already in use, please use another'});
        //                 }
        //                 i++;
        //             }
        //             res.render('register', {
        //                 errors,
        //                 username,
        //                 firstname,
        //                 lastname,
        //                 email
        //             });
        //         }
        //         else{
        //             console.log(userObj);
        //             let success = [];
        //             dbObj.collection("users").insertOne(userObj, function(err, result) {
        //             if (err) throw err;
        //             functons.sendMail(firstname, Email, Token);
        //             success.push({msg: 'Registration successful! Please check your email to verify your account'});
        //             res.render('login', {success});
        //             });
        //         }
        //     });
        //client.close();
        // })
    }
});


module.exports = router;