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

/* GET Register page. */
router.get('/register', function(req, res, next) {
  res.render('Register', { title: 'Express' });
});

/* GET index page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET DoctorsLoginpage. */
router.get('/DoctorLog',function(req,res,next){
res.render('DoctorsLogin',{title:"Admin"})
  });

  // router.get('/home',function(req,res,next){
  //   res.render('homepage',{title:"home" });
  // });


router.get('/patientdetails',function(req,res,next){
  //fetching data to from db to display it in our table doctors.ejs   InsertRecord
data='';
  db.collection("patientdetails").find({}).toArray(function(err,docs){
    if(err){
      console.log(err)
    }else{
     db.collection('patientdetails').count(
               {status : "not attended"},
               function(err,counts){
                 if(err){
                   console.log(err)
                 }else{
                  console.log(counts);
                  db.collection('patientdetails').count(
                             {status : "Attetended"},
                             function(err,attendcounts){
                              if(err){
                                console.log(err)
                              }else{
                                console.log(attendcounts)
                                db.collection('patientdetails').count(
                                            function(err,allcounts){
                                           if(err)throw err;
                                           console.log(allcounts)
                                res.render('doctors',{data:docs,counts,attendcounts,allcounts})
                                      });
                                     }
                                    });
                                   }
                                  });
                                }
                               })
  });







module.exports = router;
