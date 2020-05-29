const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";

router.get('/', (req, res) => {
    session = req.session;
    
    if (!session.objId){
        let errors = [];
        errors.push({ msg: 'You have to login to view this resource'});
        res.render('login', {errors});
    }
    else {
        dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
            if (err) throw err;
            dbObj.collection("users").find({}).toArray((err, ret) => {
                if (err) throw err;
                res.render('myLikes', { result, ret });
            });
        }); 
    }
});

module.exports = router;