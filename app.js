const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const client = require('./config/connect');

const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs'); 

//Bodyparser
app.use(express.urlencoded({extended: false}));

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));