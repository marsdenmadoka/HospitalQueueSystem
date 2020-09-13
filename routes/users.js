var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser"); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;
const { check, validationResult} = require("express-validator");
const africastalking = require('africastalking');

// Init africastalking
// const AfricasTalking = new africastalking({
//   apiKey:'d8cc5bdfb8562bd6c69fdcf38a46b5c5e7218047a6d7039a306588aa932d7b3d',
//   username: 'sandbox'
//   }, {debug: true});

//   const sms = AfricasTalking.SMS;

require('../models/User');
var User = mongoose.model('User');/*fetching the schema from model*/
var InsertRecord=mongoose.model('InsertRecord')
var DoctorUser = mongoose.model('DoctorUser');

/*message Api*/
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey:'42f310a6',
  apiSecret:'etZ9aj6vZQbV5myp'
});



mongoose.connect("mongodb+srv://marsden:madoka98@cluster0-ewzaf.mongodb.net/QueueSystem?retryWrites=true&w=majority",{useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true }); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  
// var app=express()   
// app.usje(bodyParser.json()); 
// app.use(express.static('public')); 
// app.use(bodyParser.urlencoded({ 
//     extended: true
// })); ;;

  /*recieving Register and processing it */
  router.post('/RecieveRegister',
  [
    check("name", "Please Enter a Valid Username")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password atleast 6 characters").isLength({
        min: 6
    })
],

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



/*reciving login and processing it */
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
    // req.flash('success_msg', 'User does not exist');
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


router.post('/Records',
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({
          errors: errors.array()
      });
  }

  let status="not attended";
  
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var ArrivalTime = date+' '+time;

  const {
      firstname,
      secondname,
      EnteryNo,
      Dateofbirth,
      gender,
      txtEmail,
      txtPhone,
      subject
  } = req.body;
  try {
    var userdetails =new InsertRecord({
    firstname,
    secondname,
    EnteryNo,
    Dateofbirth,
    gender,
    txtEmail,
    txtPhone,
    subject,
    status,
    ArrivalTime
});

await db.collection('patientdetails').insertOne(userdetails,function(err, collection){ 
  if (err) throw err; 
console.log("datasaved!!");  
}); 
   
return res.redirect('/index');
} catch (err) {
console.log(err.message);
res.status(500).send("Error in Saving");
}
}
);


/**creating a doctor*/

var Docname='admin';
var Docpassword='admin';
//var numSaltRounds = 10;

var doctor=new DoctorUser({
  Docname: Docname,
  Docpassword: Docpassword
  
});
// bcrypt.genSalt(numSaltRounds, function(err, salt) {
//   bcrypt.hash(doctor.Docpassword, salt, function(err, hash) {
//   });
// })
 db.collection('doctors').insertOne(doctor,function(err, collection){ 
     if (err) throw err; 
  console.log("doctor created successfull");  
          }); 


//doctor login
router.post('/DoctorLogin',
async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
      
    });
    
  }

  const { name, password } = req.body;
  try {
    let user = await db.collection('doctors').findOne({
      name
    });
    if (!user)
      return res.status(400).json({
        message: "User Not Exist"
      });

      let pass = await db.collection('doctors').findOne({
        password
      });
   if(!pass)
   return res.status(400).json({
     message:"incorrect password"
   })
  

res.redirect('/patientdetails')
   
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"+e
    });
  }
}
);


//use this asyn function here when you use callback function it wont work
router.get('/finish',
async (req, res) => {
  await db.collection('patientdetails').findOneAndUpdate(
    {"status":"not attended"},{$set: {"status": 'Attended'}},
    function(err, collection){ 
    if (err) throw err; 
console.log("Record inserted Successfully");  
}); 
    
return res.redirect('/patientdetails');
}
);

 


router.get('/message',
async(req,res)=>{
var phone = req.query.txtPhone;
console.log(phone);

  const from = '254703674938';
  const to = phone;
  const text = 'A text message sent using the Nexmo SMS API'
  nexmo.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
          console.log(err);
      } else {
          if(responseData.messages[0]['status'] === "0") {
            console.log(phone);
              console.log("Message sent successfully.");
          } else {
              console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
          }
      }
  })

});











// router.get('/delete', function(req, res, next) {
//  //will use this to the href/delete in our doctors.ejsfiles
//   var id = req.query.id;
 
//   MongoClient.connect(dburl, function(err, db) {
//     if(err) { throw err;  
//     }
//     db.collection('products', function(err, products) {
//       products.deleteOne({_id: new mongodb.ObjectID(id)});
//       if (err){
  
//        throw err;
   
//       }else{
    
//          db.close();
//           res.redirect('/');
    
//        }
//     });
//   });
// });

// router.post('/edit', function(req, res, next){ 
//   MongoClient.connect(dburl, function(err, db) {
//     if(err) { throw err; } 
    
//     var collection   = db.collection('products'); 
//     var product_name = req.body.product_name;
//     var price               = req.body.price;
//     var category     = req.body.category;
//     collection.update({'_id':new mongodb.ObjectID(req.body.id)}, 
//     { $set: {'product_name': product_name, 'price': price, 'category': category } }, function(err, result) { 
//       if(err) { throw err; } 
      
//       db.close(); 
      
//       res.redirect('/'); 
//     }); 
//   });
// });


  

module.exports = router;
