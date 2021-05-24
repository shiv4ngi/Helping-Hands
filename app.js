
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv/config');
// const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


//set up EJS

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(express.static("public"));

// Set EJS as templating engine
app.set("view engine", "ejs");

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const caretakerModel = require(__dirname + '/model');

// ----------------------------------------------------------------------------------------------

var patientSchema = new mongoose.Schema({
  name: String,
  address: String,
  age: String,
  phone: String,
  email: String,
  password: String,
  gender: String
});

patientSchema.plugin(passportLocalMongoose);

const patientModel = mongoose.model("Patient", patientSchema);

passport.use(patientModel.createStrategy());
passport.serializeUser(patientModel.serializeUser());
passport.deserializeUser(patientModel.deserializeUser());

// -----------------------------------------------------------------------------------------------------------------------------

const homeStartingContent = "Here at Helping Hands we have taken a step towards helping people. TAKING CARE OF PATIENTS emphasizes objective, professional care, such as the medical and psychological aspects of nursing. CARING FOR PATIENT is our sole objective. Young people are taking part in helping people and giving the support they need.";


//set up multer for storing uploaded files

var multer = require('multer');

var storage = multer.diskStorage({
  destination: "./public/uploads/",

  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage
});

//load the mongoose model


const item1 = new caretakerModel({

  name: "Phoebe Buffay",
  age: "32",
  address: "Bucharest, Romania",
  gender: "Female",
  salary: "15000",
  timeShift: "Day-Shift(10:00am-7:00pm)",
  imgURL: "profile.jpg",
  phone: "+123 456 789",
  email: "p@phoebe.com"
});


const defaultItems = [item1];


app.get('/', function(req, res) {
  res.render('home', {
    homeIntroduction: homeStartingContent
  });
});


//the GET request handler that provides the HTML UI

app.get('/caretakerRegister', function(req, res) {

  caretakerModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occured', err);
    } else {
      res.render('caretakerRegister', {
        items: items
      });
    }
  });

});


//the POST handler for processing the uploaded file

app.post('/caretakerRegister', upload.single('imgURL'), (req, res, next) => {

  var obj = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    salary: req.body.salary,
    timeShift: req.body.timeShift,
    imgURL: req.file.filename,
    gender: req.body.gender,
    phone: req.body.phone,
    username: req.body.username
  }

  caretakerModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      item.save();
      res.redirect('/');
    }
  });
});


app.get('/caretakerDetails', function(req, res) {

  caretakerModel.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      caretakerModel.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect("/caretakerDetails");
    } else {
      if(req.isAuthenticated()){
        res.render('caretakerDetails', {
          contacts: foundItems
        });
      }else{
        res.redirect("/patientLogin");
      }

    }

  });

});



app.get("/contacts/:_id", function(req, res) {
  const caretakerName = _.lowerCase(req.params._id);

  caretakerModel.find({}, function(err, foundItems) {

    foundItems.forEach(function(contact) {
      const storedCaretakerName = _.lowerCase(contact._id);

      if (storedCaretakerName === caretakerName) {

        res.render("caretakerProfile", {
          name: contact.name,
          age: contact.age,
          address: contact.address,
          salary: contact.salary,
          timeShift: contact.timeShift,
          imgURL: contact.imgURL,
          phone: contact.phone,
          email: contact.email,
          more: contact.more
        });
      }
    });

  });

});


app.get('/patientRegister', function(req, res) {

  patientModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occured', err);
    } else {
      res.render('patientRegister', {
        items: items
      });
    }
  });
});

app.post('/patientRegister', function(req, res) {

  const obj = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    gender: req.body.gender,
    phone: req.body.phone,
    username: req.body.username
  };

  patientModel.register(obj, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/patientRegister');
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect("/caretakerDetails");
      });
    }
  });

});

// app.get('/caretakerLogin', function(req, res) {
//   res.render('caretakerLogin');
// });
//
// app.post('/caretakerLogin', function(req, res) {
//
//   const username = req.body.username;
//   const password = req.body.password;
//
//   caretakerModel.findOne({
//     email: username
//   }, function(err, foundUser) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundUser) {
//         if (foundUser.password === password) {
//           console.log("User Exists!");
//           // res.render("/");
//         }
//       }
//     }
//   })
// })

app.get('/patientLogin', function(req, res) {
  res.render('patientLogin');
});

app.post('/patientLogin', function(req, res) {


  const user = new patientModel({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect("/caretakerDetails");
      });
    }
  });
  });


app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});







var port = process.env.PORT || '3000'
app.listen(port, err => {
  if (err)
    throw err
  console.log('Server listening on port', port)
})
