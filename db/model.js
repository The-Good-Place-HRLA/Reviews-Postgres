const db = require('./index');
const mongoose = require('mongoose');

var reviewsSchema = new mongoose.Schema({
  productID: Number,
  reviews: [{
    username: String,
    title: String,
    stars: Number,
    date: Date,
    reviewText: String,
    recommended: Boolean,
    photos: [String],
    helpful: {
      yes: Number,
      no: Number
    }
  }]
});

var Reviews = mongoose.model('Reviews', reviewsSchema);

module.exports = Reviews;
