const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');

module.exports = {
    //Send verification email
    sendMail: function sendMail(firstname, email, token){
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user:"dontreply.matcha@gmail.com",
                // process.env.EMAIL,
                pass:"IT7matcha7"
                // process.env.PASSWORD
            },
            tls: { rejectUnauthorized: false }
        });

        let mailOptions = {
            from: '"Match_Admin" <DontReply.Matcha@gmail.com>',
            to: email,
            subject: 'Verification email',
            html: '<p>Hi '+ firstname +'</p><p>This is an account verification email. <br/>Please click the link below to verify your email address.<br> <a href="http://localhost:5000/verify/'+ token +'">Verify</a></p><br/><p>Regards<br/>Matcha Admin</p>'
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(err) throw err;
            console.log('Verificaton email sent.');
        });
    },
    forgotMail: function forgotMail(firstname, email, token){
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        let mailOptions = {
            from: '"Match_Admin" <DontReply.Matcha@gmail.com>',
            to: email,
            subject: 'Forgot password email',
            html: '<p>Hi '+ firstname +'</p><p>This is a password reset email.<br/>Please click the link below to reset your account.<br><a href="http://localhost:5000/resetPassword/'+ token +'">Reset</a></p><br/><p>Regards<br/>Matcha Admin</p>'
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(err) throw err;
            console.log('Password reset email sent.');
        });
    },
    sendNewMail: function sendNewMail(firstname, email, token){
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        let mailOptions = {
            from: '"Match_Admin" <DontReply.Matcha@gmail.com>',
            to: email,
            subject: 'Verification email',
            html: '<p>Hi '+ firstname +'</p><p>This is an account verification email for your new email. <br/>Please click the link below to verify your email address.<br> <a href="http://localhost:5000/verifyNewMail/'+ token +'">Verify</a></p><br/><p>Regards<br/>Matcha Admin</p>'
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(err) throw err;
            console.log('Verificaton new email sent.');
        });
    },
    age: function age(year, month, day){
        var current_Date = new Date();
        var current_Year = current_Date.getFullYear();
        var current_Month = current_Date.getMonth();
        var current_Day = current_Date.getDay();
    
        var age = current_Year - year;
        if(current_Month < (month - 1)){
            age--;
        }
        if(((month - 1) == current_Month) && (current_Day < day)){
            age--;
        }
        return(age);
    },
    del: function del(filePath){
        if(filePath != undefined){
            fs.unlink(filePath, err => {
            if(err) throw err;
            
            //console.log('Previous profile picture deleted');
            })
        }
    },
    deleteEmail: function deleteEmail(firstname, email){
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        let mailOptions = {
            from: '"Match_Admin" <DontReply.Matcha@gmail.com>',
            to: email,
            subject: 'Account deletion',
            html: '<p>Hi '+ firstname + '<br>Unfortunately, due to the outcome of a thorough investigation we have discontiued your access to our service with your current account due to a serious breach in our terms of service...<br>If you choose to return we hope you behave better in future<br></p><br/><p>Regards<br/>Matcha Admin</p>'
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(err) throw err;
            console.log('Account deletion email sent.');
        });
    },

    popularity: function popularity(views, likes, blocks){
      let Views = Math.floor(views * 0.25);
      let Likes = Math.floor(likes * 0.50);
      let Blocks = Math.floor(blocks * 0.50);

      let popularity = (Views + Likes) - Blocks;
      popularity = (popularity / 10) <= 10 ? Math.Floor(popularity / 10) + 5  : 10;

      return (popularity);
    }
}