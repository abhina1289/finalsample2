const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  bookId:{
    type:String,
    required:true,
    unique:true
  },
  published:{
    type:Number,
  },
  genre:{
    type:String,

  },
 
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;