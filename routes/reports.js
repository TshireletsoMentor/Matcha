const express = require('express');
const router = express.Router();
const func = require('../functions');

router.get('/', (req, res) => {

    session = req.session;

    if(!session.objId){
        let errors = [];
        erros.push({ msg: 'You have to login to view this resource.'})
        res.render('login', {errors});
    }
    else if (session.email != "admin@matcha.com"){
        res.render('404');
    }
    else{
        dbObj.collection("reports").find({}).toArray((err, ret) => {
            if (err) throw err;
            res.render('reports', { ret })
        });
    }
});

module.exports = router;