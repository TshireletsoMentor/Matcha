const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const uniqid = require('uniqid');
const functons = require('../functions');

router.get('/', (req, res) => {
    let errors = [];

    errors.push({msg: 'No report ID provided'});
    dbObj.collection("users").find({email: sessionStorage.email}).toArray((err, result) => {
        if (err) throw err;
        dbObj.collection("users").find({"online": "Y"}).toArray((err, ret) => {
            if (err) throw err;
            res.render('dashboard', {result, ret, errors});
        });
    });
});

router.get('/:blockReqId', (req, res) => {
    let blockReqId = req.params.blockReqId;
    let o_id = new ObjectId(blockReqId);
    let errors = [];
    session = req.session;

    if (!session.objId) {
        errors.push({ msg: "You have to login to view this resource."});
        res.render('login', {errors});
    }
    else if (session.email != "admin@matcha.com") {
        res.render('404');
    }
    else {
        dbObj.collection("blockReq").find({_id:o_id}).toArray((err, ret) => {
            if (err) throw err;
            let offender = new ObjectId(ret[0].ret[0]._id);
            let complainant = new ObjectId(ret[0].result[0]._id);
            dbObj.collection("users").find({ _id: offender }).toArray((err, ret1) => {
                if (err) throw err;
                dbObj.collection("users").find({ _id: complainant }).toArray((err, ret2) => {
                    if (err) throw err;
                    res.render('viewBlockReq', { ret1, ret2, o_id });
                });
            });
        });
    }
});

module.exports = router;