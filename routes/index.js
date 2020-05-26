var express = require('express');
var router = express.Router();
require('../models/User');
var InsertRecord=mongoose.model('InsertRecord')
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


router.get('/doctors',function(req,res,next){

  InsertRecord.find({}, function (err, allDetails) {
    if (err) {
        console.log(err);
    } else {
        res.render("doctors", { details: allDetails })
    }
})
});
module.exports = router;
