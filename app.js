const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const f1 = require("./caretaker");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Ultrices vitae auctor eu augue ut lectus arcu bibendum at.";

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

let contacts = f1.contacts;
let patients = [];

app.get('/', function(req,res){
  res.render('home', {homeIntroduction:homeStartingContent});
});

app.get('/caretakerDetails', function(req,res){
  res.render('caretakerDetails',{contacts:contacts});
});

app.get('/caretakerLogin', function(req,res){
  res.render('caretakerLogin');
});

app.post('/caretakerLogin', function(req,res){
  const contact = {

    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    salary: req.body.salary,
    timeShift: req.body.timeShift,
    imgURL: req.body.imgURL,
    phone: req.body.phone,
    email: req.body.email
  };

  contacts.push(contact);
  console.log(contacts);

  res.redirect("/");

});

app.get('/patientLogin', function(req,res){
  res.render('patientLogin');
});

app.post('/patientLogin', function(req, res){
  const patient = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    timeShift: req.body.timeShift,
    gender: req.body.gender,
    phone: req.body.phone,
    email: req.body.email,
    profileImage: req.body.profileImage
  };
  patients.push(patient);
  console.log(patients);
});



app.get("/contacts/:id", function(req, res){
  const caretakerName = _.lowerCase(req.params.id);

  contacts.forEach(function(contact){
    const storedCaretakerName = _.lowerCase(contact.id);

    if (storedCaretakerName === caretakerName) {
      res.render("caretakerProfile", {
        name: contact.name,
        age: contact.age,
        address: contact.address,
        salary: contact.salary,
        timeShift: contact.timeShift,
        imgURL: contact.imgURL,
        phone:contact.phone,
        email:contact.email,
        more: contact.more
      });
    }
  });

});


app.get('/test', function(req,res){
  res.render('test');
});

app.post('/test', function(req, res){
  console.log(req.body);
});





app.listen(3000, function(){
  console.log("Server started at port 3000");
});
