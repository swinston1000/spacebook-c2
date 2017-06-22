var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var handler = function(res) {
  return function(err, data) {
    if (err) {
      throw err;
    }
    res.send(data);
  }
}

// 1) to handle getting all posts and their comments
app.get('/posts', function(req, res) {
  Post.find(handler(res));
});

// 2) to handle adding a post
app.post('/posts', function(req, res) {
  Post.create(req.body, handler(res));
});

// 3) to handle deleting a post
app.delete('/posts/:postId', function(req, res) {
  Post.findByIdAndRemove(req.params.postId, handler(res));
});

// 4) to handle adding a comment to a post
app.post('/posts/:postId/comments', function(req, res) {
  var update = { $push: { comments: req.body } };
  Post.findByIdAndUpdate(req.params.postId, update, { new: true }, handler(res));
});

// 5) to handle deleting a comment from a post
app.delete('/posts/:postId/comments/:commentId', function(req, res) {
  var update = { $pull: { comments: { _id: req.params.commentId } } };
  Post.findByIdAndUpdate(req.params.postId, update, { new: true }, handler(res));
});

app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});
