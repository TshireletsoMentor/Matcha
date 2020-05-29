const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const functions = require('../functions');

router.post('/', (req, res) => {

    session = req.session;
    let errors = [];
    let success = [];

    dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
        if(err) throw err;

        if(result[0].profilePicture){
            functions.del('uploads/' + result[0].profilePicture);
        }
        dbObj.collection("users").updateOne({"email": session.email}, {$set: {"profilePicture": ""}}, (err, response) => {
            if(err) throw err;
            result[0].profilePicture = "";
            console.log(result);
            console.log("Profile picture set to default");
            res.render('imageUpload', {result});
        })
    })
})

module.exports = router;