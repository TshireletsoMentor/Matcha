const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

router.get('/', (req, res) => {
    
    session = req.session;

    if(session.email){
        // let errors = [];
        // errors.push({msg: 'You have to logout to view this this page'});
        connection.query("SELECT * FROM users", (err, result) => {
          if (err) throw err;
          res.render('dashboard', { result });
        });
        // dbObj.collection("users").find({}).toArray((err, result) => {
        //     if(err) throw err;

        //     res.render('dashboard', { result });
        // });
    }
    else{
         res.render('welcome');
    }
});

module.exports = router;