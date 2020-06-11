const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

router.get('/', (req, res) => {
    
    session = req.session;

    if(session.email){
      let perPage = 8;
      let page = req.params.page || 1;
      
      const sql1 = "SELECT * FROM users WHERE email = ?";
      connection.query(sql1, [
        session.email
      ], (err, result) => {
        if (err) throw err;
        
        const sql4 = "SELECT COUNT(*) AS count FROM users WHERE username NOT IN (?, ?) AND suspended != 1";
        connection.query(sql4, [
          'admin',
          session.username,
        ], (err, count) => {
          if (err) throw err;
          const sql5 = "SELECT * FROM users WHERE username NOT IN (?, ?) AND suspended != 1 LIMIT ?, ?";
          connection.query(sql5, [
            'admin',
            session.username,
            (perPage * page) - perPage,
            perPage,
          ], (err, ret) => {
            if (err) throw err;
            res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage) });
          })
        })
      })
      // let errors = [];
        // errors.push({msg: 'You have to logout to view this this page'});
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