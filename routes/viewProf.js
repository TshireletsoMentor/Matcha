const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const uniqid = require('uniqid');
const functons = require('../functions');

router.get('/', (req, res) => {
    let errors = [];

    errors.push({msg: "No reference account provided!"});
    dbObj.collection("users").find({}).toArray((err, result) => {
        if(err) throw err;
        res.render('dashboard', {result, errors});
    });
})

router.get('/:viewToken', (req, res) => {
    let viewToken = req.params.viewToken;
    let errors = [];
    let views = 0;
    session = req.session;

    if (!session.objId){
        let errors = [];
        errors.push({ msg: 'You have to login to view this resource'});
        res.render('login', {errors});
    }
    else {
        dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, result) => {
            if (err) throw err;
            if (result[0]._id != session.objId ) {

                var myquery = { "viewToken": viewToken };
                var newvalues = { $addToSet: { profileViews: session.objId } };

                dbObj.collection("users").updateOne(myquery, newvalues, (err, response) => {
        
                    if (err) throw err;
                });
            }
        });

        dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, result) => {
            if (err) throw err;
            views = Math.floor(result[0].profileViews.length / 10) + result[0].popularity;
            dbObj.collection("users").updateOne({"viewToken": viewToken}, {$set: {popularity: views > 6 ? views - 1 : views } }, (err, respone) => {
                if(err) throw err;
                res.render('viewProf', { result });
            });
        });
    }
});

module.exports = router;