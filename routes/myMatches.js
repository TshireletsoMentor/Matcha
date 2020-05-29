const express = require('express')
const router = express.Router()
const func = require('../functions')

router.get('/', (req, res) => {
    
    session = req.session;

    if(!session.objId){
        let errors = []
        errors.push({msg: 'You have to log in to view this resource'});
        res.render('login', {errors});
    }
    else{
        dbObj.collection("users").find({email: session.email}).toArray((err, result) => {
            if (err) throw err;
            dbObj.collection("users").find({}).toArray((err, ret) => {
                if (err) throw err
                res.render('myMatches', {result, ret})
            })
        })
    }
})

module.exports = router;