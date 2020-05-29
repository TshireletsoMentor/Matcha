const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const uniqid = require('uniqid');
const ObjectId = require('mongodb').ObjectId;

router.get('/', (req, res) => {
    let errors = [];
        
    if(session.email){
        errors.push({ msg: 'No account provided!'});
        dbObj.collection("users").find({email: session.email}).toArray((err, result) =>{
            if (err) throw err;
            dbObj.collection("users").find({}).toArray((err, ret) =>{
                if (err) throw err;
                res.render("dashboard", { result, ret, errors });
            });
        });
    }
    else{
        res.render("login")
    }
});

router.get('/:userId', (req, res) => {
    var userId = req.params.userId;
    let o_id = new ObjectId(userId);
    let errors = [];
    let success = [];
    
    dbObj.collection("users").find( { _id: o_id } ).toArray((err, result) => {
        if (err) throw err;
        if (!result.length){

            errors.push({ msg: "Invalid token!"});
            dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
                if (err) throw err;
                dbObj.collection("users").find({"online": "Y"}).toArray((err, ret) => {
                    if (err) throw err;
                    res.render('dashboard', { result, ret, errors });
                });
            });
        } else if (result[0].suspended == 1) {
            dbObj.collection("users").updateOne( { _id: o_id }, {$set: {suspended: 0} }, (err, response) => {

                if (err) throw err;
                success.push({ msg: "Account successfully updated"});
                dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
                    if (err) throw err;
                    dbObj.collection("users").find({"online": "Y"}).toArray((err, ret) => {
                        if (err) throw err;
                        res.render('dashboard', { result, ret, success });
                    });
                });
            });
        } else {
            dbObj.collection("users").updateOne( { _id: o_id }, {$set: {suspended: 1} }, (err, response) => {

                if (err) throw err;
                success.push({ msg: "Account successfully updated"});
                dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
                    if (err) throw err;
                    dbObj.collection("users").find({"online": "Y"}).toArray((err, ret) => {
                        if (err) throw err;
                        res.render('dashboard', { result, ret, success });
                    });
                });
            });
        }
    });
});

module.exports = router;