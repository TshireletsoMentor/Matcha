const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const functions = require('../functions');

router.post('/', (req, res) => {

    session = req.session;
    let errors = [];
    let success = [];

    const sql1 = "SELECT * FROM users WHERE email = ?";
    connection.query(sql1, [
      session.email
    ], (err, result) => {
      if(err) throw err;

      if(result[0].profilePicture){
          functions.del('uploads/' + result[0].profilePicture);
      }

      const sql2 = "UPDATE users SET profilePicture = '' WHERE email = ?";
      connection.query(sql2, [
        session.email
      ], (err, result) => {
        if(err) throw err;
        result[0].profilePicture = "";
        console.log(result);
        console.log("Profile picture set to default");
        res.render('imageUpload', {result});
      })
    })


    // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
    //     if(err) throw err;

    //     if(result[0].profilePicture){
    //         functions.del('uploads/' + result[0].profilePicture);
    //     }
    //     dbObj.collection("users").updateOne({"email": session.email}, {$set: {"profilePicture": ""}}, (err, response) => {
    //         if(err) throw err;
    //         result[0].profilePicture = "";
    //         console.log(result);
    //         console.log("Profile picture set to default");
    //         res.render('imageUpload', {result});
    //     })
    // })
})

module.exports = router;