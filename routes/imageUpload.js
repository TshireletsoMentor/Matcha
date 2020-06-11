const express = require('express');
const router = express.Router();
const multer = require('multer');
const connection = require('../config/connect');
const functions = require('../functions');
const path = require('path')



const storage = multer.diskStorage({
    destination : './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('userPic');

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extName){
        return cb(null, true);
    }else{
        cb('Error: Image files Only!')
    }
}

router.get('/', (req, res) => {
    
    session = req.session;

    if(!session.username){
        let errors = [];
        errors.push({msg: 'You have to login to view this resource'});
        res.render('login', {errors});
    }
    else{
      const sql = "SELECT * FROM users WHERE username = ?";
      connection.query(sql, [
        session.username
      ], (err, result) => {
        if(err) throw err;
          
        if(result[0].profilePicture != 'undefined' || result[0].profilePicture != '')
            res.render('imageUpload', {result});
        else{
            res.render('imageUpload');
        }
      })

      // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
      //     if(err) throw err;
          
      //     if(result[0].profilePicture != 'undefined' || result[0].profilePicture != '')
      //         res.render('imageUpload', {result});
      //     else{
      //         res.render('imageUpload');
      //     }
      // });
    }
});

router.post('/', (req, res) => {
    session = req.session;
    let errors = [];
    let success = [];

    upload(req, res, (err) => {
        if(err){
            errors.push({ msg: err});
            res.render('uploadImage', {errors})
        }
        else{
            if(req.file == undefined){
                errors.push({msg: "No FIle Selected!"});

                const sql1 = "SELECT * FROM users WHERE username = ?";
                connection.query(sql1, [
                  session.username
                ], (err, result) => {
                  if (err) throw err;

                  res.render('imageUpload', {errors, result});
                })

                // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
                //     if(err) throw err;
                //     res.render('imageUpload', {errors, result});
                // });
            }
            else{
              const sql2 = "SELECT * FROM users WHERE username = ?";
              connection.query(sql2, [
                session.username
              ], (err, result) => {
                if (err) throw err;

                if(result[0].profilePicture){
                  if(result[0].profilePicture.match(/userPic/g)){
                    functions.del('uploads/' + result[0].profilePicture);
                    // console.log("Del function for profile working");
                  }
                }

                if (req.file){
                  const sql3 = "UPDATE users SET profilePicture = ? WHERE username = ?";
                  connection.query(sql3, [
                    req.file.filename,
                    session.username
                  ], (err, response) => {
                    if (err) throw err;

                    const sql4 = "SELECT * FROM users WHERE username = ?";
                    connection.query(sql4, [
                      session.username
                    ], (err, result) => {
                      if (err) throw err;

                      success.push({ msg: "Image Uploaded!"});
                      res.render('imageUpload', { success, result})
                    })
                  });
                }
              });

                // dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
                //     if(err) throw err;

                //     if(result[0].profilePicture != ""){
                //         functions.del('uploads/' + result[0].profilePicture);
                //         console.log("Del function for profile working");
                //     }

                // if(req.file){
                //     dbObj.collection("users").updateOne({"email": session.email}, {$set: {"profilePicture": req.file.filename}}, (err, reponse) => {
                //         if(err) throw err;

                //         dbObj.collection("users").find({"email": session.email}).toArray((err, result) => {
                //             if(err) throw err;

                //             success.push({ msg: "Image Uploaded!"});
                //             res.render('imageUpload', { success, result})
                //         });
                //     });
                //     }
                // });
            }
        }
    });
});

module.exports = router;