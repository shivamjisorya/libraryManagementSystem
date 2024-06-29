var express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port= 2032;
const path = require('path');
var ejs = require('ejs');
const flash = require('connect-flash');
var session  = require('express-session');
// var cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended:true}));
app.use(
   session({
     key: "user_sid",
     secret: "shivamjisorya",
     resave: false,
     saveUninitialized: false,
     cookie: { maxAge: 300000 } 
     // session timeout of 5 min
   })
 );
 app.use(flash());

// app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static('views'));
app.set('view engine' , 'ejs');
var router = require("./controller/auth");
app.use('/',router);
app.listen(port ,
   console.log(`the server is runnning on ${port}`)
);

