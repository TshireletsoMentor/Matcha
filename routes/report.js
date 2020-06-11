const express = require('express');
const router = express.Router();
const connection = require('../config/connect');


router.get('/', (req, res) => {
    let errors = [];
    let session = req.session;

    if(session.username == 'admin'){
      errors.push({msg: "No reference to user you want to report"});
      let perPage = 8;
      let page = req.params.page || 1;

      const sql1 = "SELECT * FROM users";
      connection.query(sql1, [], (err, result) => {
        if (err) throw err;
        var sqlY = "SELECT COUNT(*) AS count FROM users"
        connection.query(sqlY, (err, count) => {
          if (err) throw err;
          const sql5 = "SELECT * FROM users LIMIT ?, ?";
          connection.query(sql5, [
            (perPage * page) - perPage,
            perPage,
          ], (err, ret) => {
            if (err) throw err;
            res.render('dashboard', { errors, result, ret, current: page, pages: Math.ceil(count[0].count / perPage), count: count[0].count });
          })
        })       
      })
    } else {
      res.redirect('/login');
    }

    // errors.push({msg: "No reference to user you want to report"});
    // dbObj.collection("users").find({}).toArray((err, result) => {
    //     if(err) throw err;
    //     res.render('dashboard', {result, errors});
    // });
});

router.get('/:viewToken', (req, res) => {
    let viewToken = req.params.viewToken;
    let errors = [];
    session = req.session;

    if(!session.objId){
        let errors = [];
        errors.push({msg: "You have to login to view this resource!"});
        res.render('login')
    }
    else{
      const sql1 = "SELECT * FROM users WHERE viewToken = ?";
      connection.query(sql1, [
        viewToken
      ], (err, result) => {
        if (err) throw err;

        if(!result.length){
          let perPage = 8;
          let page = req.params.page || 1;

          errors.push({msg: "Invalid token"});

          const sql1 = "SELECT * FROM users";
          connection.query(sql1, [], (err, result) => {
            if (err) throw err;
            var sqlY = "SELECT COUNT(*) AS count FROM users"
            connection.query(sqlY, (err, count) => {
              if (err) throw err;
              const sql5 = "SELECT * FROM users LIMIT ?, ?";
              connection.query(sql5, [
                (perPage * page) - perPage,
                perPage,
              ], (err, ret) => {
                if (err) throw err;
                res.render('dashboard', { errors, result, ret, current: page, pages: Math.ceil(count[0].count / perPage), count: count[0].count });
              })
            })       
          })
        }
        else{
            session.complaintAbout = result[0].username;
            res.render('report');
        }
      })

        // dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, result) => {
        //     if(err) throw err;
        //     if(!result.length){
        //         errors.push({msg: "Invalid token"});
        //         res.render('dashboard', { result, errors})
        //     }
        //     else{
        //         session.complaintAbout = result[0]._id;
        //         res.render('report');
        //     }
        // });
    }
});

router.post('/', (req, res) => {
    
    session = req.session;
    let errors = [];
    let success = [];
    const { subject, text} = req.body;

    if(!subject || !text){
        errors.push({msg: "Please fill in all fields"});
    }
    if (!subject.match(/^(.*[A-Za-z\d!$%@#£€*?&,. ])$/) || !text.match(/^(.*[A-Za-z\d!$%@#£€*?&,. ])$/gm)){
        errors.push({msg: 'Complaint contains illegal characters, please rephrase'});
    }
    
    if (text.length > 10000) {
        errors.push({msg: 'Message exceeds character limit, please summarize'});
    }

    if (errors.length > 0) {
        res.render('report', { errors });
    }

    if(errors.length == 0){
      const sql = "INSERT INTO reports (complainant, complaintAbout, subject, text) VALUES (?, ?, ?, ?)";
      connection.query(sql, [
        session.username,
        session.complaintAbout,
        subject,
        text
      ], (err, result) => {
        if (err) throw err;

        success.push({msg: 'Report successfully issued!'})
        res.render('report', { success });
      })

        // var reportObj = {
        //     complainant: session.username,
        //     complaintAbout: session.complaintAbout,
        //     subject: subject,
        //     text: text
        // }

        // dbObj.collection("reports").insertOne(reportObj, (err, response) => {
        //     if(err) throw err;
        //     success.push({msg: 'Report successfully issued!'})
        //     res.render('report', { success });
        // });
    }
});

module.exports = router;