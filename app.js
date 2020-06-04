const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connection = require('./config/connect');
const favicon = require('express-favicon');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const path = require('path');

const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs'); 

//Bodyparser
app.use(express.urlencoded({extended: false}));

//favicon
app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')));
//app.use(express.static('favicon'));
app.use(express.static('uploads'));

//Express sessions
const sessionStore = new MySQLStore({}, connection);
app.use(session({
    key: process.env.SESSION_COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

//routes
app.use('/', require('./routes/index'));
//
app.use('/blockReq', require('./routes/blockReq'));
// app.use('/dashboardPagination', require('./routes/dashboardPagination'));
app.use('/deleteAcc', require('./routes/deleteAcc'));
app.use('/deleteAcc2', require('./routes/deleteAcc2'));
//
app.use('/forgotPassword', require('./routes/forgotPassword'));
app.use('/galleryUpload', require('./routes/galleryUpload'));
app.use('/galleryDel', require('./routes/galleryDel'));
app.use('/imageDel', require('./routes/imageDel'));
app.use('/imageUpload', require('./routes/imageUpload'));
app.use('/like', require('./routes/like'));
app.use('/like2', require('./routes/like2'));
//
app.use('/like3', require('./routes/like3'));
app.use('/like4', require('./routes/like4'));
//
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/myLikes', require('./routes/myLikes'));
//
app.use('myMatches', require('./routes/myMatches'))
//
app.use('/myProfile', require('./routes/myProfile'));
app.use('/register', require('./routes/register'));
app.use('/report', require('./routes/report'));
app.use('/reports', require('./routes/report'));
app.use('/resetPassword', require('./routes/resetPassword'));
app.use('/search', require('./routes/search'));
//
app.use('/suspendAcc', require('./routes/suspendAcc'));
//
app.use('/verify', require('./routes/verify'));
app.use('/viewBy', require('./routes/viewBy'));
app.use('/viewProf', require('./routes/viewProf'));
//
app.use('/viewBlockReq', require('./routes/viewBlockReq'));
//
app.use('/verifyNewMail', require('./routes/verifyNewMail'));
app.use('/updateProfile', require('./routes/updateProfile'));


app.use((req, res, next) => {
    res.status(404).render('404');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));