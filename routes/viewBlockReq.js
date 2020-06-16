const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

router.get('/', (req, res) => {
  let errors = [];
  session = req.session;

  if (!session.username){
    errors.push({ msg: "You have to login to view this resource."});
    res.render('login', {errors});
  }
  else if (session.username != "admin"){
      res.render('404');
  }
  else{
    errors.push({msg: 'No report ID provided'});
    const sql = "SELECT * FROM blocked WHERE processed = '0'";
    connection.query(sql, [], (err, result) => {
      if (err) throw err;

      res.render('blockReq', { result, errors });
    });
    // dbObj.collection("blocked").find({}).toArray((err, ret) => {
    //     if(err) throw err;
    //     res.render('blockReq', {ret});
    // });
  }

    // dbObj.collection("users").find({email: sessionStorage.email}).toArray((err, result) => {
    //     if (err) throw err;
    //     dbObj.collection("users").find({"online": "Y"}).toArray((err, ret) => {
    //         if (err) throw err;
    //         res.render('dashboard', {result, ret, errors});
    //     });
    // });
});

router.get('/:blockReqId', (req, res) => {
    let blockReqId = req.params.blockReqId;
    let errors = [];
    session = req.session;

    if (!session.username) {
        errors.push({ msg: "You have to login to view this resource."});
        res.render('login', {errors});
    }
    else if (session.username != "admin") {
        res.render('404');
    }
    else {
      const sql1 = "SELECT * FROM blocked WHERE id = ?";
      connection.query(sql1, [
        blockReqId
      ], (err, result) => {
        if (err) throw err;

        const sql2 = "SELECT * FROM users WHERE username = ?";
        connection.query(sql2, [
          result[0].username
        ], (err, ret1) => {
          if (err) throw err;

          const sql3 = "SELECT * FROM users WHERE username = ?";
          connection.query(sql3, [
            result[0].blocked
          ], (err, ret2) => {
            if (err) throw err;

            res.render('viewBlockReq', { ret1, ret2, result });
          })
        })
      })
      // dbObj.collection("blockReq").find({_id:o_id}).toArray((err, ret) => {
      //     if (err) throw err;
      //     let offender = new ObjectId(ret[0].ret[0]._id);
      //     let complainant = new ObjectId(ret[0].result[0]._id);
      //     dbObj.collection("users").find({ _id: offender }).toArray((err, ret1) => {
      //         if (err) throw err;
      //         dbObj.collection("users").find({ _id: complainant }).toArray((err, ret2) => {
      //             if (err) throw err;
      //             res.render('viewBlockReq', { ret1, ret2, o_id });
      //         });
      //     });
      // });
    }
});

module.exports = router;