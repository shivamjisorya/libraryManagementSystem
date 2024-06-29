var express = require('express');
const router = express.Router(); 
var session = require('express-session');
const bcrypt = require ('bcrypt');
const multer = require ("multer");
const path = require('path');
const flash = require('connect-flash');

var conn  = require("../db/config");
const { error } = require('console');


// ================================================================================================
                                        // multer for upload id
// =================================================================================================

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null ,file.originalname);
    }
});

// const checkFileType = function (file, cb) {
//     const fileTypes = jpg|png|gif|jpg|jpeg;

//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

//     const mimeType = fileTypes.test(file.mimetype);

//     if (mimeType && extName) {
//         return cb(null, true);
//     } else {
//         cb("Error: You can Only Upload IMAGE files!!");
//     }
// };


const upload = multer({
    storage:storage,
    limits: { fileSize: 10000000 }
    // ,fileFilter: (req,file ,cb) =>{
    //     checkFileType(file, cb)
    // }
});

// ================================================================================================
                                        // multer for upload id
// =================================================================================================

router.post('/upload/:buttonId', upload.single('fileUpload'), (req, res) => {
    try {
        // console.log('req.file:', req.file);
        const userId = req.params.buttonId;
        const fileUpload = req.file.filename;
        


        conn.query(`UPDATE REGISTER
            SET fileUpload='${fileUpload}'
            WHERE userId='${userId}'` , async (error , result)=>{
                if(error) 
                console.log(error);
            else {
                // console.log(result);
                
        
                req.flash("message" ,"THE FILE IS SUCCESSFULLY CHANGED");
                res.redirect("/userdata");
            }
            })
    
        }
        catch(error){
            throw error;
        }
    }
);

// ====================================================================================
// ================================register post api==================================
// ====================================================================================
  

// ================================================================================================
                                        // multer for register
// =================================================================================================

const storage_register = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null,file.originalname);
    }
});
   
// const checkFileType_register = function (file, cb) {
// const fileTypes = jpg|png|gif|jpg|jpeg;

//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

//     const mimeType = fileTypes.test(file.mimetype);

//     if (mimeType && extName) {
//         return cb(null, true);
//     } else {    
//         cb("Error: You can Only Upload IMAGE files!!");
//     }
// };


const upload_register = multer({
    storage:storage_register,
    // limits: { fileSize: 10000000 },
    // fileFilter: (req,file ,cb) =>{
    //     checkFileType_register(file, cb)
    // }
});
// ================================================================================================
                                        // multer for register
// =================================================================================================
router.post('/register', upload_register.single('myfile'), async (req, res) => {
    try {
        var fileUpload = req.file.filename;
        var Username = req.body.username;
        var Email = req.body.email;
        var Age = req.body.age;
        var Password = req.body.password;

        // Promisify the database query
        const qry1 = `SELECT EMAIL FROM REGISTER`;
        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                conn.query(qry1, function(error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        // Use async/await with the promisified query
        const result = await queryPromise();

        let emailExists = false;
        for (var i = 0; i < result.length; i++) {
            if (result[i].EMAIL === Email) {
                console.log("USER ALREADY EXISTS, KINDLY PROCEED TO SIGNIN");
                req.flash("message", "User already exists");
                emailExists = true;
                break;
            }
        }
        if (emailExists) {
            res.redirect('/register');
            return;
        }

        // If the email does not exist, proceed with registration
        const hashpassword = await bcrypt.hash(Password, 10);

        const qry = `INSERT INTO REGISTER (username , email, age , password , fileUpload) VALUES ('${Username}' , 
            '${Email}' , '${Age}' , '${hashpassword}'  , '${fileUpload}' )`;

        conn.query(qry, function(error, result) {
            if (error) {
                console.error(error);
                res.redirect('/register');
                return;
            }
            // console.log(result);
            res.redirect('/login');
        });
    } catch (error) {
        console.log(error);
        res.redirect('/register');
    }
});


// ====================================================================================
// ================================register post api==================================
// ====================================================================================


// ====================================================================================
// ================================register get api==================================
// ====================================================================================

router.get('/userdata' , (req,res) =>{

    // if(req.session.email){

    try{
    conn.query("SELECT * FROM register" , (error , result)=>{
    if(error) throw error;
    // console.log(result);

    res.render('register-table',{regdata:result , message:req.flash('message')})
});
    }
catch (error) {
    console.log(error);
}
// }
// else{
//     res.redirect("/login");
// }
})

// ====================================================================================
// ================================register get api==================================
// ====================================================================================


// ====================================================================================
// ================================register delete and edit api=========================
// ====================================================================================


router.get('/deleteUser/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const deleteQuery = 'DELETE FROM register WHERE userId = ?';
  
    conn.query(deleteQuery, [userId], (error, result) => {
      if (error) throw error;
    //   console.log(result);
      console.log(`User with ID ${userId} deleted successfully`);
      req.flash("message" ,"THE FILE IS SUCCESSFULLY DELETED");

      res.redirect('/userdata')
    });
  });


  
//Create Route for Update Data Operation
router.post('/editUser/:userId',async (req, res) => {
    try {

 
        var userId = req.params.userId;
        var Username= req.body.username;
        var Email= req.body.email;
        var Age= req.body.age;
        var Password= req.body.password;
        var hashpassword = await bcrypt.hash(Password, 10);
        let qry  = `UPDATE register SET username = '${Username}', email =  '${Email}' , age ='${Age}' , password= '${hashpassword}'
         WHERE userId = '${userId}' `;


        conn.query(qry, function(error, result){
                if(error)throw error;
                // console.log(result);
                req.flash("message" ,"THE FILE IS SUCCESSFULLY EDITED!");

                res.redirect('/userdata');                         
            }
        )
    } catch (error) {
        console.log(error);
        res.redirect('/');

    }
})

  
// ====================================================================================
// ================================register delete and edit api=========================
// ====================================================================================




// ====================================================================================
// ================================logout get api======================================
// ====================================================================================

router.get("/logout", (req, res) => {
    req.session.destroy();
      res.redirect("/login");
    
  });

// ====================================================================================
// ================================logout get api======================================
// ====================================================================================


router.get('/' , (req,res) =>{
    res.render('login-form',{ message:req.flash('message')});
})

router.get('/login' , (req,res) =>{
    res.render('login-form',{ message:req.flash('message')})
})

router.get('/register' , (req,res) =>{
    res.render('registeration',{ message:req.flash('message')});
})

router.get('/changePassword' , (req,res) =>{
    res.render('changePassword');
})

router.get('/index' , (req,res) =>{
    res.render('index');
})




// ================================================================================================
                                        // session and cookie for login
// =================================================================================================

// ================================================================================================
                                        // session and cookie for login
// =================================================================================================



// ====================================================================================
// ================================login post api======================================
// ====================================================================================
router.post('/login', async (req, res) => {

    try {
        var email = req.body.email;
        var Password = req.body.password;
        req.session.email = email;
        const sqlSearch = `SELECT * FROM register WHERE email = '${email}' `;

        // console.log("sqlSearch" , sqlSearch)

        conn.query(sqlSearch, async (error, result) => {
            if (error) throw error;

            if (result.length == 0) 
            
            {
                console.log("User does not exist");
                req.flash("message" ,"incorrect login id or password ");
                res.render('login-form',{message:req.flash('message')})
            } else 
                    for(var count = 0; count < result.length; count++)
                    {
                        var hash = result[0].password;
                        if(await bcrypt.compare(Password, hash))
                        {
                            req.session.user_sid = result[count].users_id;


                            // // ================================================
                            // if (!req.session.startTime) {
                            //     req.session.startTime = Date.now();
                            //   }
                            //   const elapsedTime = Math.floor((Date.now() - req.session.startTime) / 1000);
                            //   const remainingTime = Math.max(0, 300 - elapsedTime);
                            //   if (elapsedTime % 60 === 0) {
                            //     // Send a script to the client with the remaining time
                            //     res.send(`<script>alert("Remaining time: ${remainingTime} seconds before logout.");</script>`);
                            //   } else {
                            //     res.send('');
                            //   }
                            // // ================================================
  
                            // console.log("Login Successful");
                            // req.flash("message" ,"SUCCESSFULLY LOGGED IN!!");
                            res.redirect("/index")

                        }
                        else
                        {
                            req.flash("message" ,"incorrect password !");
                            console.log("Password Incorrect");
                            res.redirect("/login")

                        }
                    }
                
            });
               
    } catch (error) {
        console.log("Error: " + error);
        res.redirect('/login');
    }
});
// ====================================================================================
// ================================login post api======================================
// ====================================================================================




// ====================================================================================
// ================================pdf file get api======================================
// ====================================================================================
router.get('/uploads/:linkId', async (req, res) => {
    try {
        // console.log('req.file:', req.file);
        const linkId = req.params.linkId;

        const sqlQuery = `SELECT fileUpload FROM register WHERE userId = '${linkId}'`;
        // console.log('SQL Query:', sqlQuery);

        conn.query(sqlQuery, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            } else {
                console.log('Query Result:', result);

                if (result.length > 0) {
                    const fileUploadData = result[0].fileUpload;
                    // console.log('File Upload Data:', fileUploadData);
                    // console.log("Data transmission successful");
                    res.send(fileUploadData);
                } else {
                    res.status(404).send("Data not found");
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
// ====================================================================================
// ================================pdf file get api======================================
// ====================================================================================




// ====================================================================================
// ================================get file name in userdata===========================
// ====================================================================================
router.get('/upload/:buttonId', async (req, res) => {
    try {
        // console.log('req.file:', req.file);
        const buttonId = req.params.buttonId;

        const sqlQuery = `SELECT fileUpload FROM register WHERE userId = '${buttonId}'`;
        // console.log('SQL Query:', sqlQuery);

        conn.query(sqlQuery, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            } else {
                // console.log('Query Result:', result);

                if (result.length > 0) {
                    const fileData = result[0].fileUpload;
                    // console.log('File Upload Data:', fileData);
                    // console.log("Data transmission successful");
                    res.send(fileData);
                } else {
                    res.status(404).send("Data not found");
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
// ====================================================================================
// ================================get filename in userdata============================
// ====================================================================================



// ====================================================================================
// ================================(REPORT) DATA FROM TABLE GET API====================
// ====================================================================================
router.get('/invoice/:linkId', (req, res) => {
    const linkId = req.params.linkId;

    const editQuery = 'SELECT * FROM register WHERE userId = ? ';

    conn.query(editQuery, [linkId], (error, result) => {
        if (error) {
            console.error("Error in database query:", error);
            res.status(500).send("Internal Server Error");
            return;
        }
        const date = new Date();
        // console.log(date);

        // console.log("Query result for invoice:", result);
        res.render('invoice', { invoiceData: result , date:date });
    });
});
// ====================================================================================
// ================================(REPORT) DATA FROM TABLE GET API====================
// ====================================================================================




module.exports=router;