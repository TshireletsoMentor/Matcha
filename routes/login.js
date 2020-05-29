const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const client = require('../config/connect');
const dbname = "Matcha";
const uniqid = require('uniqid');
const functions = require('../functions');

//login page

//Handle already logged in error
router.get('/', (req, res) => {
    
    session = req.session;

    if(session.email){
        // let errors = [];
        // errors.push({msg: 'You have to logout to view this this page'});

        client.connect((err, db) => {
            if(err) throw err;

            dbObj = client.db(dbname);

            dbObj.collection("users").find({}).toArray((err, result) => {
                if(err) throw err;

                res.render('dashboard', { result });
            })
        });
    }
    else{
            res.render('login');
    }
});

//Handle actual log in process
router.post('/', (req, res) => {
    const {username, password} = req.body;
    let perPage = 8;
    let page = req.params.page || 1;
    let errors = [];

    if(!username || !password){
        errors.push({msg: 'Please fill in both fields'});
    }

    if (!username.match(/^[A-Za-z0-9]+$/)){
        errors.push({msg: 'Invalid email, please try again'});
    }

    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)){
        errors.push({ msg: 'Password must be at least 8 characters, include at least one uppercase letter, one lowercase letter, and one number'})
    }

    if(errors.length > 0){
        res.render('login', {
            errors,
            username
        });
    }
    else{
        var Username = username.toLowerCase();
        client.connect((err, db) => {
            if(err) throw err;

            dbObj = client.db(dbname);

            dbObj.collection('users').find({username: Username}).toArray((err, result) => {
                if(err) throw err;
                //console.log(result);
                if(result.length == 0){
                    errors.push({msg: 'Invalid email or password'});
                    res.render('login', {errors});
                }
                else if(bcrypt.compareSync(password, result[0].password) == false){
                    errors.push({msg: 'Invalid email or password'});
                    res.render('login', {errors});
                }
                else if (result[0].verify == 'N'){
                    functions.funct1(result[0].firstName, result[0].email, result[0].token);
                    errors.push({msg: 'You need to verify your email, check your emails'});
                    res.render('login', {errors});
                }
                else{
                    let ViewToken = uniqid() + uniqid();
                    dbObj.collection('users').updateOne({"username": Username}, {$set:{online: "Y", viewToken: ViewToken}}, (err, response) => {
                        if(err) throw err;

                        session = req.session;
                        if(Username != "admin") {
                            session.username = Username;
                            session.email = result[0].email;
                            session.firstName = result[0].firstname;
                            session.objId = result[0]._id;
                            session.extProfComp = result[0].extProfComp;
                            session.suspended = result[0].suspended;
                            console.log(session)
                            //console.log(req);

                            setTimeout(() => {
                                dbObj.collection('users').find({"username": Username}).toArray((err, result) => {
                                    if(err) throw err;
                                    dbObj.collection("users", (err, collection) => {
                                        collection.countDocuments({}, (err, count) => {
                                            dbObj.collection("users").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, ret) => {
                                                if (err) throw err;
                                                res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count / perPage) });
                                            });
                                        });
                                    });
                                });
                            }, 500)
                        }else{
                            session.username = Username;
                            session.email = result[0].email;
                            session.objId = result[0]._id;
                            session.extProfComp = result[0].extProfComp;
                            setTimeout(() => {
                                dbObj.collection("users", (err, collection) => {
                                    collection.countDocuments({}, (err, count) => {
                                        dbObj.collection("users").find({}).skip((perPage * page) - perPage).limit(perPage).toArray((err, ret) => {
                                            if (err) throw err;
                                            res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count / perPage) });
                                        });
                                    });
                                });
                            }, 500)
                        }
                    });
                }
            });
        });
    }
});


module.exports = router;
