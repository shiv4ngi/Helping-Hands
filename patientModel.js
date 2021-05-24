const mongoose = require('mongoose');

var conn=mongoose.Collection;

var patientSchema = new mongoose.Schema({
  name: String,
  address: String,
  age: String,
  phone: String,
  email: String,
  password: String,
  gender: String
});


//Patient is a model which has a schema patientSchema

var patientModel = new mongoose.model("Patient", patientSchema);

module.exports=patientModel;
