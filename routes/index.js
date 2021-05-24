var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// var MongoClient = require('mongodb').MongoClient;

require("../models/User");
var InsertRecord = mongoose.model("InsertRecord");
//"mongodb+srv://username:yourpassword@cluster0-ewzaf.mongodb.net/QueueSystem?retryWrites=true&w=majority"
mongoose.connect("mongodb://localhost:27017/myqueue", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("Login", { title: "Express" });
});

/* GET Register page. */
router.get("/register", function (req, res, next) {
  res.render("Register", { title: "Express" });
});

/* GET index page. */
router.get("/index", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET DoctorsLoginpage. */
router.get("/DoctorLog", function (req, res, next) {
  res.render("DoctorsLogin", { title: "Admin" });
});

// router.get('/home',function(req,nres,next){
//   res.render('homepage',{title:"home" });
// });

router.get("/patientdetails", async (req, res) => {
  //fetching data to from db to display it in our table doctors.ejs   InsertRecord
  try {
    let docs = await db.collection("patientdetails").find({}).toArray();
    data = "";

    let counts = await db
      .collection("patientdetails")
      .count({ status: "not attended" });
    let attendcounts = await db
      .collection("patientdetails")
      .count({ status: "Attended" });
    let allcounts = await db.collection("patientdetails").count();

    res.render("doctors", {
      data: docs,
      counts,
      attendcounts,
      allcounts,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

// db.collection('patientdetails').find(
//   {EnteryNo:{$gt:1,$lt :8}},       //({ name: { $regex: 'Krol'} })
//   function(err,agecount){
//     if(err){
//       console.log(err)
//  }else{
//    console.log(agecount.length)
//    res.render('doctors',{data:docs,counts,attendcounts,allcounts,agecount})
//  }
//   }
// )
