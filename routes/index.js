var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// var MongoClient = require('mongodb').MongoClient;


require('../models/User');
var InsertRecord=mongoose.model('InsertRecord')

mongoose.connect('mongodb://localhost:27017/myqueue',{useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  




/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('Login', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('Register', { title: 'Express' });
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home',function(req,res,next){
  res.render('homepage',{title:"home" });
});

router.get('/patientdetails',function(req,res,next){
  //fetching data to from db to display iy in our table doctors.ejs   InsertRecord
data='';
pdata='';
  db.collection("patientdetails").find({}).toArray(function(err,docs){
    if(err){
      console.log(err)
    }else{
     db.collection('patientdetails').count(
               {status : "not attended"},
               function(err,cols){
                 if(err)throw err;
                 console.log(cols);
                 res.render('doctors',{data:docs,cols})
            });
          
      
    }
   
  })
});


// function getAnalytics(){

//  let waitingpatient = db.collection('patientdetails').count(
//       {status : "not attended"},
//       function(err,collection){
//         if(err)throw err;
//       });

//       let attetendpatient=db.collection('patientdetails').count(
//         {status : "attended"},
//         function(err,collection){
//           if(err)throw err;
//         });

//         let Totalpatient=db.collection('patientdetails').count(
//           function(err,collection){
//       if(err)throw err;
//           });
//     }


// var Count=router.get('/waitingpatient',
// async(req,res)=>{
//
// });

router.get('/DoctorLog',function(req,res,next){

  res.render('DoctorsLogin',{title:"Admin"})
  
})



module.exports = router;
