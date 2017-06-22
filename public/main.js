var SpacebookApp = function() {

  var posts = [];

  function _renderPosts() {
    var $posts = $(".posts");
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var errorHandler = function(err, status) {
    console.error(status);
  }

  $.get({
    url: "/posts",
    success: function(data) {
      posts = data;
      _renderPosts();
    },
    error: errorHandler
  });

  function addPost(newPost) {
    console.log(newPost);
    $.post({
      url: "/posts",
      data: newPost,
      error: errorHandler,
      success: function(data) {
        posts.push(data);
        _renderPosts();
      }
    });
  }

  var removePost = function(index, id) {
    $.ajax({
      type: "delete",
      url: "/posts/" + id,
      error: errorHandler,
      success: function(data) {
        posts.splice(index, 1);
        _renderPosts();
      }
    })
  };

  var addComment = function(newComment, postIndex, postId) {
    $.post({
      url: "/posts/" + postId + "/comments",
      data: newComment,
      error: errorHandler,
      success: function(data) {
        posts[postIndex] = data;
        _renderComments(postIndex);
      }
    });
  };


  var deleteComment = function(postIndex, postId, commentId) {
    $.ajax({
      url: "/posts/" + postId + "/comments/" + commentId,
      type: "delete",
      error: errorHandler,
      success: function(data) {
        posts[postIndex] = data;
        _renderComments(postIndex);
      }
    });
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};

var app = SpacebookApp();

$('#post-form').on('submit', function() {
  var $input = $("#postText");
  app.addPost({ text: $input.val() });
  $input.val("");
  return false;
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
  var $post = $(this).closest('.post')
  var index = $post.index();
  var id = $post.data().id;
  app.removePost(index, id);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('submit', '.commentForm', function() {
  var $comment = $(this).find('.comment');
  var $user = $(this).find('.name');
  var $post = $(this).closest('.post');
  var postIndex = $post.index();
  var postId = $post.data().id;
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex, postId);
  $comment.val("");
  $user.val("");

  return false
});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var $post = $(this).closest('.post');
  var postIndex = $post.index();
  var postId = $post.data().id;
  var commentId = $(this).closest('.comment').data().id;

  app.deleteComment(postIndex, postId, commentId);
});
