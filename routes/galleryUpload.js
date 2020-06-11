const express = require('express');
const router = express.Router();
const multer = require('multer');
const connection = require('../config/connect');
const functions = require('../functions');
const path = require('path')
const fs = require('fs');


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
      const sql1 = "SELECT * FROM users WHERE username = ?";
      connection.query(sql1, [
        session.username
      ], (err, result) => {
        if(err) throw err;
            
        if(result[0])
          res.render('imageUpload', {result});
      });

      // dbObj.collection("users").find({"username": session.username}).toArray((err, result) => {
      //     if(err) throw err;
          
      //     if(result[0])
      //         res.render('imageUpload', {result});
      // });
    }
});

router.post('/', (req, res) => {
    session = req.session;
    let error = [];
    let succes = [];

      upload(req, res, (err) => {
          const { gallery } = req.body;
          if(err){
              error.push({ msg: err});
              res.render('uploadImage', {error})
          }
          else{
              // console.log(req.file);
              // console.log(req.body);
              if(req.file == undefined){
                  error.push({msg: "No FIle Selected!"})

                  const sql2 = "SELECT * FROM users WHERE username = ?";
                  connection.query(sql2, [
                    session.username
                  ], (err, result) => {
                    if(err) throw err;

                    res.render('imageUpload', {error, result});
                  });

                  // dbObj.collection("users").find({"username": session.username}).toArray((err, result) => {
                  //     if(err) throw err;
                  //     res.render('imageUpload', {error, result});
                  // }); 
              }
              else if(gallery == undefined){
                  error.push({ msg: "Select one of the fields you want to upload to!"});
                  
                  var path = "uploads/" + req.file.filename;

                  if(fs.existsSync(path)){
                      functions.del(path);
                      //console.log("File deleted")
                  }
                  
                  const sql3 = "SELECT * FROM users WHERE username = ?";
                  connection.query(sql3, [
                    session.username
                  ], (err, result) => {
                    if(err) throw err;
                    
                    res.render('imageUpload', {error, result});
                  });

                  // dbObj.collection("users").find({"username": session.username}).toArray((err, result) => {
                  //     if(err) throw err;
                  //     res.render('imageUpload', {error, result});
                  // });
              }
              else{
                  let i = req.body.gallery;
                  var pic = "pic" + i;
                  if(i == 1 || i == 2 || i == 3 || i == 4){
                    const sql4 = "SELECT * FROM users WHERE username = ?"
                    connection.query(sql4, [
                      session.username
                    ], (err, result) => {
                      if(err) throw err;

                      if(result[0][pic] != "" ){
                        functions.del('uploads/' + result[0][pic]);
                        // console.log("Del function for gallery working");
                      }
                      if(req.file){
                        const sql5 = "UPDATE users SET ?? = ? WHERE username = ?";
                        connection.query(sql5, [
                          [pic],
                          req.file.filename,
                          session.username
                        ], (err, result) => {
                          if (err) throw err;

                          const sql6 = "SELECT * FROM users WHERE username = ?";
                          connection.query(sql6, [
                            session.username
                          ], (err, result) => {
                            if (err) throw err;

                            succes.push({ msg: "Gallery Uploaded!"});
                            //console.log(result)
                            res.render('imageUpload', { succes, result})
                          })
                        })
                      }
                    })

                    // dbObj.collection("users").find({"username": session.username}).toArray((err, result) => {
                    //     if(err) throw err;

                    //     if(result[0][pic] != "" ){
                    //         functions.del('uploads/' + result[0][pic]);
                    //         //console.log("Del function for gallery working");
                    //     }
                        
                    //     if(req.file){
                    //         dbObj.collection("users").updateOne({"username": session.username}, {$set: {[pic]: req.file.filename}}, (err, reponse) => {
                    //             if(err) throw err;
        
                    //             dbObj.collection("users").find({"username": session.username}).toArray((err, result) => {
                    //                 if(err) throw err;
        
                    //                 succes.push({ msg: "Gallery Uploaded!"});
                    //                 //console.log(result)
                    //                 res.render('imageUpload', { succes, result})
                    //             });
                    //         });
                    //     }
                    // });
                  }
              }
          }
      });
});

module.exports = router;