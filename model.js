

// Step 2 - connect to the database

const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://helpinghandsUser:helpinghands123@cluster0.fq3xu.mongodb.net/helpinghandsDB?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true,   useCreateIndex:true }, err => {
        console.log('connected')
    });
var conn=mongoose.Collection;

var caretakerSchema = new mongoose.Schema({
  name: String,
  age: String,
  address: String,
  gender: String,
  salary: String,
  timeShift: String,
  imgURL: String,
  phone: String,
  email: String
});

// caretakerSchema.plugin(passportLocalMongoose);

//Caretaker is a model which has a schema caretakerSchema

var caretakerModel = mongoose.model("Caretaker", caretakerSchema);

module.exports=caretakerModel;
