 var mysql = require('mysql2');
 var conn = mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user:'sql12716905',
    password:'UUGPzAgKYb',
    database: 'sql12716905'

 });
 conn.connect (function(error){
    if(error) throw error;
    console.log("connection successfull");
 }
 )
 module.exports= conn;
