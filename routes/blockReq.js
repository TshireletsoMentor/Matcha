const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    session = req.session;

    if (!session.objId){
        let errors = [];
        errors.push({ msg: "You have to login to view this resource."});
        res.render('login', {errors});
    }
    else if (session.email != "admin@matcha.com"){
        res.render('404');
    }
    else{
        dbObj.collection("blockReq").find({}).toArray((err, ret) => {
            if(err) throw err;
            res.render('blockReq', {ret});
        });
    }
})

module.exports = router;