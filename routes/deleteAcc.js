const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const uniqid = require('uniqid');
const ObjectId = require('mongodb').ObjectId;
const func = require('../functions');

router.get('/', (req, res) => {
    let errors = [];
        
    if(session.email){
        errors.push({ msg: 'No account provided!'});
        dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
            if (err) throw err;
            dbObj.collection("users").find({}).toArray((err, ret) => {
                if (err) throw err;
                res.render("dashboard", { result, ret, errors });
            });
        });
    }
    else{
        res.render("login")
    }
});

router.post('/:reportId', (req, res) => {
    var reportId = req.params.reportId;
    let o_id = new ObjectId(reportId);
    let errors = [];
    let success = [];

    dbObj.collection("reports").find( { _id: o_id } ).toArray((err, result) => {
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
        } else {
            dbObj.collection("reports").find( { _id: o_id } ).toArray((err, result) => {
                if (err) throw err;
                let userId = new ObjectId(result[0].complaintAbout);
                dbObj.collection("users").find( { _id: userId } ).toArray((err, result1) => {
                    if (err) throw err;
                    func.deleteEmail(result1[0].firstName, result1[0].email, result1[0].token);
                    dbObj.collection("users").deleteOne( { _id: userId }, (err, response) => {
                        if (err) throw err;
                        dbObj.collection("users").deleteOne( { _id: userId }, (err, response) => {
                            if (err) throw err;
                            dbObj.collection("reports").deleteOne( { _id: o_id }, (err, response) => {
                                if (err) throw err;
                                success.push({ msg: "Account successfully deleted!"});
                                dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
                                    if (err) throw err;
                                    dbObj.collection("users").find({"online": "Y"}).toArray((err, ret) => {
                                        if (err) throw err;
                                        res.render('dashboard', { result, ret, success });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    })
});

module.exports = router;