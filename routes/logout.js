const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";

//Logout page
router.get('/', (req, res) => {
    let errors = [];
    session = req.session;

    dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
        if(err) throw err;

        else{
            if(session.email){
                dbObj.collection("users").updateOne({"email": session.email}, {$set:{online: "N", lastOn: Date()}}, (err, response) => {
                    if(err) throw err;
        
                    session.email = "";
                    session.username = "";
                    session.firstName = "";
                    session.objId = "";
                    session.extProfComp = "";
                    req.session.destroy();
                    console.log("User logged out");
                    console.log(session);
                    errors.push({msg: 'You are now logged out'});
                    res.render('login', {errors});
                });
            }
        }
    });
});

module.exports = router;