const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const uniqid = require('uniqid');
const functons = require('../functions');

router.get('/', (req, res) => {
    let errors = [];

    errors.push({msg: "No reference to user you want to report"});
    dbObj.collection("users").find({}).toArray((err, result) => {
        if(err) throw err;
        res.render('dashboard', {result, errors});
    });
});

router.get('/:viewToken', (req, res) => {
    let viewToken = req.params.viewToken;
    let errors = [];
    session = req.session;

    if(!session.objId){
        let errors = [];
        errors.push({msg: "You have to login to view this resource!"});
    }
    else{
        dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, result) => {
            if(err) throw err;
            if(!result.length){
                errors.push({msg: "Invalid token"});
                res.render('dashboard', { result, errors})
            }
            else{
                session.complaintAbout = result[0]._id;
                res.render('report');
            }
        });
    }
});

router.post('/', (req, res) => {
    
    session = req.session;
    let errors = [];
    let success = [];
    const { subject, text} = req.body;

    if(!subject || !text){
        errors.push({msg: "Please fill in all fields"});
    }
    if (!subject.match(/^(.*[A-Za-z\d!$%@#£€*?&,. ])$/) || !text.match(/^(.*[A-Za-z\d!$%@#£€*?&,. ])$/gm)){
        errors.push({msg: 'Complaint contains illegal characters, please rephrase'});
    }
    
    if (text.length > 1000) {
        errors.push({msg: 'Message exceeds character limit, please summarize'});
    }

    if (errors.length > 0) {
        res.render('report', { errors });
    }

    if(errors.length == 0){
        var reportObj = {
            complainant: session.objId,
            complaintAbout: session.complaintAbout,
            subject: subject,
            text: text
        }

        dbObj.collection("reports").insertOne(reportObj, (err, response) => {
            if(err) throw err;
            success.push({msg: 'Report successfully issued!'})
            res.render('report', { success });
        });
    }
});

module.exports = router;