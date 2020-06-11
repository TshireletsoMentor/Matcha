const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const utilPop = require('../utilPop');

router.get('/', (req, res) => {
    let errors = [];
    session = req.session;

    if (session.email){
      res.redirect('login');
      // errors.push({msg: "No reference account provided!"});
      // let perPage = 8;
      // let page = req.params.page || 1;
      
      // const sql1 = "SELECT * FROM users WHERE email = ?";
      // connection.query(sql1, [
      //   session.email
      // ], (err, result) => {
      //   if (err) throw err;
        
      //   if (session.username == 'admin'){
      //     var sqlY = "SELECT COUNT(*) AS count FROM users WHERE online = 'Y'";
      //   }else{
      //     var sqlY = "SELECT COUNT(*) AS count FROM users"
      //   }
      //   connection.query(sqlY, (err, count) => {
      //     if (err) throw err;
      //     const sql5 = "SELECT * FROM users LIMIT ?, ?";
      //     connection.query(sql5, [
      //       (perPage * page) - perPage,
      //       perPage,
      //     ], (err, ret) => {
      //       if (err) throw err;
      //       res.render('dashboard', { errors, result, ret, current: page, pages: Math.ceil(count[0].count / perPage), count: count[0].count });
      //     })
      //   })
      // })
    }else{
      res.render('login');
    }



    // errors.push({msg: 'No reference provided!'});
    // dbObj.collection("users").find({}).toArray((err, result) => {
    //     if(err) throw err;
    //     res.render('dashboard', { result, errors });
    // })
})

router.get('/:viewToken', (req, res) => {
    let viewToken = req.params.viewToken;
    let errors = [];
    let views = 0;
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

        if(result.length == 1){

          if (result[0].username != session.username && session.username != 'admin') {
            const sql2 = "SELECT * FROM likes WHERE username = ? AND liked = ?";
            connection.query(sql2, [
              session.username,
              result[0].username
            ], (err, liked) => {
              if (err) throw err;

              if(liked.length == 0){
                const sql3 = "INSERT INTO likes (username, liked) VALUES (?, ?)";
                connection.query(sql3, [
                  session.username,
                  result[0].username
                ], (err, response) => {
                  if (err) throw err;

                  utilPop.popularity(result[0].username);
                })
              } else {
                const sql3 = "DELETE FROM likes WHERE username = ? AND liked = ?";
                connection.query(sql3, [
                  session.username,
                  result[0].username  
                ], (err, response) => {
                  if (err) throw err;

                  utilPop.popularity(result[0].username);
                })
              }
            })
          }
        }
      })
      setTimeout(() => {
        let perPage = 8;
        let page = req.params.page || 1;
        
        if(session.username){
          if(session.username != 'admin'){
            const sql3 = "SELECT * FROM users WHERE username = ?";
            connection.query(sql3, [
              session.username
              ], (err, result) => {
                if (err) throw err;
                const sql4 = "SELECT COUNT(*) AS count FROM users WHERE username NOT IN (?, ?) AND suspended != 1";
                connection.query(sql4, [
                  'admin',
                  session.username,                            
                ], (err, count) => {
                  if (err) throw err;
                  const sql5 = "SELECT * FROM users WHERE username NOT IN (?, ?) AND suspended != 1 ORDER BY RAND() LIMIT ?, ?";
                  connection.query(sql5, [
                    'admin',
                    session.username,
                    (perPage * page) - perPage,
                    perPage,
                  ], (err, ret) => {
                    if (err) throw err;
                    res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage) })
                  })
                })
            })
          } else {
            const sql4 = "SELECT COUNT(*) AS count FROM users WHERE online = 'Y'";
            connection.query(sql4, (err, count) => {
              if (err) throw err;
              const sql5 = "SELECT * FROM users WHERE username != 'admin' AND online = 'Y' AND suspended != 1 LIMIT ?, ?";
              connection.query(sql5, [
                (perPage * page) - perPage,
                perPage,
              ], (err, ret) => {
                if (err) throw err;
                res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage), count: count[0].count })
              })
            })
          }
        }
      }, 100) 

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
        //             res.render('dashboard', { result, ret });
        //         });
        //     });
        // }, 100) 
    }
})

module.exports = router;