var express = require('express');
var router = express.Router();
var express=require("express"); 
var bodyParser=require("body-parser"); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { check, validationResult} = require("express-validator/check");
require('../models/User');
var User = mongoose.model('User');/*fetching the schema from model*/

mongoose.connect('mongodb://localhost:27017/myqueue'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  
var app=express()   
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 



  /*recieving Register and processing it */
  router.post('/RecieveRegister',
 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        password
    } = req.body;
    try {
        let user = await db.collection('details').findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                msg: "User Already Exists"
            });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);


       await db.collection('details').insertOne(user,function(err, collection){ 
                 if (err) throw err; 
           console.log("Record inserted Successfully");  
          }); 
                  
              return res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
}
);



/*reciving login andprocessing it */
router.post('/RecieveLogin',
async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const { email, password } = req.body;
  try {
    let user = await db.collection('details').findOne({
      email
    });
    if (!user)
      return res.status(400).json({
        message: "User Not Exist"
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect Password !"
      });
res.redirect('/index')
   
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }
}
);


module.exports = router;
