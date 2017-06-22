var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

//you don't need a comments collection
//you only need a posts collection

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  text: String,
  user: String

});

var postSchema = new Schema({
  text: String,
  comments: [commentSchema]

});

var Post = mongoose.model('post', postSchema)

module.exports = Post
