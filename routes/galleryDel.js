const express = require('express');
const router = express.Router();
const client = require('../config/connect');
const dbname = "Matcha";
const functions = require('../functions');

router.post('/', (req, res) => {

    session = req.session;
    let error = [];
    let succes = [];

    dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
        if(err) throw err;
        
        for(var i = 1; i <= 4; i++){
            var pic = "pic" + i;
            if(result[0][pic]){
                functions.del('uploads/' + result[0][pic]);
            }
        }

        dbObj.collection("users").updateOne({"email": session.email}, {$set: {"pic1": "", "pic2": "", "pic3": "", "pic4": ""}}, (err, response) => {
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
});

module.exports = router;