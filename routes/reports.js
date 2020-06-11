const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const func = require('../functions');

router.get('/', (req, res) => {

    session = req.session;

    if(!session.objId){
        let errors = [];
        res.render('login');
    }
    else if (session.email != "admin@matcha.com"){
        res.render('404');
    }
    else{
      const sql = "SELECT * FROM reports";
      connection.query(sql, [], (err, result) => {
        if (err) throw err;

        res.render('reports', { result });
      })
        // dbObj.collection("reports").find({}).toArray((err, ret) => {
        //     if (err) throw err;
        //     res.render('reports', { ret })
        // });
    }
});

module.exports = router;