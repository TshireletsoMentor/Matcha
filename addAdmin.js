const bcrypt = require('bcrypt');
const client = require('./config/connect');
const dbname = "Matcha";

let hash = bcrypt.hashSync("123456Admin", 10);

client.connect((err, db) => {
    
    if (err) throw err;
    dbObj = client.db(dbname);

    dbObj.collection("users").find({email: "admin@matcha.com"}).toArray((err, ret) => {
        if (err) throw err;
        if(!ret.length){
            var Admin = {

                username: "admin",
                email: "admin@matcha.com",
                password: hash,
                verified: "Y",
                extProfComp: 1,
            }
            dbObj.collection("users").insertOne(Admin, (err, result) => {
                if (err) throw err;
                console.log("The overlord has been born");
                db.close();
            });
        }
        else{
            console.log("There can only be ONE overloard, die faker!");
            db.close();
        }
    });
});