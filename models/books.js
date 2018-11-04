const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const BookSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  review:{
    type: String,
    default: 'n/a'
  },
  pages:{
    type: String,
    default: 'n/a'
  },
  rating:{
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  price:{
    type: String,
    default: 'n/a'
  },
  reviewerId:{
    type: String,
    required: true
  }
}, {timestamps: true});

const Book = mongoose.model('books', BookSchema)

module.exports = { Book }