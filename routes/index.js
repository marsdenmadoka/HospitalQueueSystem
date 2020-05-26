var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');


require('../models/User');
var InsertRecord=mongoose.model('InsertRecord')

mongoose.connect('mongodb://localhost:27017/myqueue'); 
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


router.get('/patientdetails',function(req,res,next){
data='';

  db.collection("patientdetails").find({}).toArray(function(err,docs){
    if(err){
      console.log(err)
    }else{
      res.render('doctors',{data:docs})
    }
  })

  // user.find({}, function(err, docs){
	// 	if(err) res.json(err);
	// 	else    res.render('index', {users: docs});
	// });



//   InsertRecord.find({}, function (err, records) {
//     if (err) {
//         console.log(err);
//     } else {
//         res.render("doctors",{users:records });
//     }
// })
});
module.exports = router;
