const express = require('express')
const router = express.Router()
const func = require('../functions')
const connection = require('../config/connect')

router.get('/', (req, res) => {
    
    session = req.session;

    if(!session.username){
        let errors = []
        errors.push({msg: 'You have to log in to view this resource'});
        res.render('login', {errors});
    }
    else{
      const sql = "SELECT * FROM users WHERE username IN (SELECT liked FROM likes WHERE username = ? AND liked IN (SELECT username FROM likes WHERE liked = ?))";
      connection.query(sql, [
        session.username,
        session.username
      ], (err, result) => {
        if (err) throw err;

        res.render('myMatches', { result })
      })

      // dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
      //       if (err) throw err;
      //       dbObj.collection("users").find({}).toArray((err, ret) => {
      //           if (err) throw err
      //           res.render('myMatches', {result, ret})
      //       })
      //   })
    }
})

module.exports = router;