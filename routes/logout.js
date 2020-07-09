const express = require('express');
const router = express.Router();
const connection = require('../config/connect');
const moment = require('moment');

//Logout page
router.get('/', (req, res) => {
    let errors = [];
    session = req.session;

    if (session.email){
      const sql = "UPDATE users SET online = ?, lastOn = ? WHERE email = ?";
      connection.query(sql, [
        'N',
        moment().format('MMM D YYYY, h:mm:ss'),
        session.email
      ], (err, result) => {
        if (err) throw err;

        session.email = "";
        session.username = "";
        session.firstName = "";
        session.objId = "";
        session.extProfComp = "";
        session.query = "";
        session.profilePicture = "";
        req.session.destroy();
        console.log("User logged out");
        console.log(session);
        // errors.push({msg: 'You are now logged out'});
        res.redirect('login');
      });
    }else{
      res.render('login');
    }

});

module.exports = router;