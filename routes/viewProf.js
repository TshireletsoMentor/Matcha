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
      //     const sql5 = "SELECT * FROM users WHERE (username <> ? OR username <> ?) AND suspended <> 1 LIMIT ?, ?";
      //     connection.query(sql5, [
      //       'admin',
      //       session.username,
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
    
    // dbObj.collection("users").find({}).toArray((err, result) => {
    //     if(err) throw err;
    //     res.render('dashboard', {result, errors});
    // });
})

router.get('/:viewToken', (req, res) => {
    let viewToken = req.params.viewToken;
    let errors = [];
    session = req.session;
   

    if (!session.username){
        let errors = [];
        errors.push({ msg: 'You have to login to view this resource'});
        res.render('login', {errors});
    } else {
      const sql1 = "SELECT * FROM users WHERE viewToken = ?";
      connection.query(sql1, [
        viewToken
      ], (err, ret) => {
        if (err) throw err;
        // console.log(ret[0].username)
        if (ret[0].username != session.username && session.username != 'admin') {
          const sql2 = "SELECT * FROM profileviews WHERE username = ? AND viewed = ?";
          connection.query(sql2, [
            session.username,
            ret[0].username
          ], (err, visited) => {
            if (err) throw err;

            if (visited.length == 0){
              const sql3 = "INSERT INTO profileviews (username, viewed) VALUES (?, ?)";
              connection.query(sql3, [
                session.username,
                ret[0].username
              ], (err, response) => {
                if (err) throw err;

                utilPop.popularity(ret[0].username);
              })
            }
          })
        }

        // setTimeout(())
        const sql5 = "SELECT * FROM users WHERE viewToken = ?";
          connection.query(sql5, [
            viewToken
          ], (err, result) => {
            if (err) throw err;

            res.render('viewProf', { result });
          })
        })
      
      // dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, result) => {
      //     if (err) throw err;
      //     if (result[0].id != session.objId ) {

      //         var myquery = { "viewToken": viewToken };
      //         var newvalues = { $addToSet: { profileViews: session.objId } };

      //         dbObj.collection("users").updateOne(myquery, newvalues, (err, response) => {
      
      //             if (err) throw err;
      //         });
      //     }
      // });

      // dbObj.collection("users").find({"viewToken": viewToken}).toArray((err, result) => {
      //     if (err) throw err;
      //     views = Math.floor(result[0].profileViews.length / 10) + result[0].popularity;
      //     dbObj.collection("users").updateOne({"viewToken": viewToken}, {$set: {popularity: views > 6 ? views - 1 : views } }, (err, respone) => {
      //         if(err) throw err;
      //         res.render('viewProf', { result });
      //     });
      // });
    }
});

module.exports = router;