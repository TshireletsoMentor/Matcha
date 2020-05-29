const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";

router.get('/', (req, res) => {
    
    session = req.session;

    if(session.email){
        // let errors = [];
        // errors.push({msg: 'You have to logout to view this this page'});
        dbObj.collection("users").find({}).toArray((err, result) => {
            if(err) throw err;

            res.render('dashboard', { result });
        });
    }
    else{
         res.render('welcome');
    }
});

module.exports = router;