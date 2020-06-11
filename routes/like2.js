const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const utilPop = require('../utilPop');

router.get('/', (req, res) => {
    session = req.session; 

    if (!session.username){
      let errors = [];
      errors.push({ msg: 'You have to login to view this resource'});
      res.render('login', {errors});
    }else if (session.username == 'admin') {
      res.redirect('login');
    } else {
      const sql = "SELECT * FROM users WHERE username IN (SELECT liked FROM likes WHERE username = ?) AND suspended != 1";
      connection.query(sql, [
        session.username
      ], (err, result) => {
        if (err) throw err;

        res.render('myLikes', { result });
      })
    }
    // dbObj.collection("users").find({}).toArray((err, result) => {
    //     if(err) throw err;
    //     res.render('dashboard', { result, errors });
    // })
})

router.get('/:viewToken', (req, res) => {
    let viewToken = req.params.viewToken;
    let errors = [];
    session = req.session;

    if (!session.username){
        let errors = [];
        errors.push({ msg: 'You have to login to view this resource'});
        res.render('login', {errors});
    }
    else {
      const sql1 = "SELECT * FROM users WHERE viewToken = ?";
      connection.query(sql1, [
        viewToken
      ], (err, result) => {
        if (err) throw err;

        if (result[0].username != session.username && session.username != 'admin') {

          const sql3 = "DELETE FROM likes WHERE username = ? AND liked = ?";
          connection.query(sql3, [
            session.username,
            result[0].username  
          ], (err, response) => {
            if (err) throw err;

            utilPop.popularity(result[0].username);
          })
        }

        setTimeout(() => {
          const sql2 = "SELECT * FROM users WHERE username IN (SELECT liked FROM likes WHERE username = ?) AND suspended != 1";
          connection.query(sql2, [
            session.username
          ], (err, result) => {
            if (err) throw err;

            res.render('myLikes', { result });
          });
        }, 100)
      });

        // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
        //     if (err) throw err;

        //     dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, ret) => {
        //         if (err) throw err;
                
        //         if(ret[0].email != session.email){
        //             if (result[0].myLikes.includes("" + ret[0]._id) == false) {
        //                 var myquery = { "email": session.email };
        //                 var newvalues = { $addToSet: { myLikes: "" + ret[0]._id } };

        //                 dbObj.collection("users").updateOne(myquery, newvalues, (err, response) => {
        //                     if (err) throw err;

        //                     if(response.result.nModified > 0){
        //                         var myquery1 = { "email": ret[0].email };
        //                         var newvalues1 = { $addToSet: { likedBy: session.objId } };

        //                         dbObj.collection("users").updateOne(myquery1, newvalues1, (err, response) => {
        //                             if(err) throw err;

        //                             if(response1.result.nModified > 0){
        //                                 dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, ret1) => {
        //                                     if(err) throw err;
        //                                     likes = Math.floor((ret1[0].likedBy.length * 0.2) + ret1[0].popularity);
        //                                     var myquery2 = {"email": ret[0].email};
        //                                     var newvalues2 = {$set: {popularity: likes}};
        
        //                                     dbObj.collection("users").updateOne(myquery2, newvalues2, (err, response) => {
        //                                         if(err) throw err;
        //                                     });
        //                                 });
        //                             }
        //                         });
        //                     }
        //                 });
        //             } else {
        //                 var myquery = { "email": session.email };
        //                 var newvalues = { $pull: { myLikes: "" + ret[0]._id } };
                        
        //                 dbObj.collection("users").updateOne(myquery, newvalues, (err, response) => {
        //                     if (err) throw err;

        //                     if(response.result.nModified > 0){
        //                         var myquery1 = {"email": ret[0].email};
        //                         var newvalues1 = {$pull: {likedBy: session.objId } };

        //                         dbObj.collection("users").updateOne(myquery1, newvalues1, (err, response1) => {
        //                             if(err) throw err;

        //                             if(response1.result.nModified > 0){
        //                                 dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, ret1) => {
        //                                     if(err) throw err;
        //                                     likes = Math.floor(ret1[0].popularity - 0.2);
        //                                     var myquery2 = {"email": ret[0].email};
        //                                     var newvalues2 = {$set: {popularity: likes}};
        
        //                                     dbObj.collection("users").updateOne(myquery2, newvalues2, (err, response) => {
        //                                         if(err) throw err;
        //                                     });
        //                                 });
        //                             }
        //                         });
        //                     }
        //                 });
        //             }
        //         }
        //     });
        // });
        // setTimeout(() => {
        //     dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
        //         if (err) throw err;
        //         dbObj.collection("users").find({}).toArray((err, ret) => {
        //             if (err) throw err;
        //             res.render('myLikes', { result, ret });
        //         });
        //     });
        // }, 100) 
    }
})

module.exports = router;