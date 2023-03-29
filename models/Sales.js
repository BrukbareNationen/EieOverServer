const mongoose = require('mongoose');


const SalesSchema = mongoose.Schema({
  saleId: {
    type: Number
  },
  price: Number,
  date: String,
  type: String,
  properties: [{
    type : {type: String},
    coordinates: [],
    matrikkelNumber: String,
    text : {
      line: Number,
      text: String
    } 
  }],
  multiple: Boolean,
  coordinates: [],
  text: String
});

module.exports = mongoose.model('Sales', SalesSchema);