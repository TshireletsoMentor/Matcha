const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const functions = require('../functions');

router.post('/', (req, res) => {

    session = req.session;
    let error = [];
    let succes = [];

    const sql1 = "SELECT * FROM users WHERE email = ?";
    connection.query(sql1, [
      session.email
    ], (err, result) => {
      if(err) throw err;
        
      for(var i = 1; i <= 4; i++){
        var pic = "pic" + i;
        if(result[0][pic]){
            functions.del('uploads/' + result[0][pic]);
        }
      }

      const sql2 = "UPDATE users SET ?? = '', ?? = '', ?? = '', ?? = '' WHERE email = ?";
      connection.query(sql2, [
        'pic1',
        'pic2',
        'pic3',
        'pic4',
        session.email
      ], (err, result) => {
        if(err) throw err;
        for(var i = 1; i <= 4; i++){
            var pic = "pic" + i;
            result[0][pic] = "";
        }
        succes.push({msg: "Gallery has been cleared!"});
        //console.log("Gallery cleared!");
        res.render('imageUpload', {succes, result});
      })
    })

    // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
    //     if(err) throw err;
        
    //     for(var i = 1; i <= 4; i++){
    //         var pic = "pic" + i;
    //         if(result[0][pic]){
    //             functions.del('uploads/' + result[0][pic]);
    //         }
    //     }

    //     dbObj.collection("users").updateOne({"email": session.email}, {$set: {"pic1": "", "pic2": "", "pic3": "", "pic4": ""}}, (err, response) => {
    //         if(err) throw err;
    //         for(var i = 1; i <= 4; i++){
    //             var pic = "pic" + i;
    //             result[0][pic] = "";
    //         }
    //         succes.push({msg: "Gallery has been cleared!"});
    //         //console.log("Gallery cleared!");
    //         res.render('imageUpload', {succes, result});
    //     })
    // })
});

module.exports = router;