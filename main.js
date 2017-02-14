var SpacebookApp = function() {
    var posts = [];

    // the current id to assign to a post
    var currentId = 0;
    var $posts = $('.posts');

    var _findPostById = function(id) {
        for (var i = 0; i < posts.length; i += 1) {
            if (posts[i].id === id) {
                return posts[i];
            }
        }
    };

    var createPost = function(text) {
        var post = {
            text: text,
            id: currentId
        };

        currentId += 1;

        posts.push(post);
    };

    var renderPosts = function() {
        $posts.empty();

        for (var i = 0; i < posts.length; i += 1) {
            var post = posts[i];
            $posts.append('<p class="post" data-id=' + post.id + '>' + '<a href="#" class="remove">remove</a> ' + post.text + '</p>');

        }
    };

    var test = "test";

    var removePost = function(currentPost) {
        var $clickedPost = $(currentPost).closest('.post');
        var id = $clickedPost.data().id;

        var post = _findPostById(id);

        posts.splice(posts.indexOf(post), 1);
        $clickedPost.remove();
    };

    return {
        createPost: createPost,
        renderPosts: renderPosts,
        removePost: removePost
    };
}

var app = SpacebookApp();

// immediately invoke the render method
app.renderPosts();

// Events
$('.add-post').on('click', function(e) {
    e.preventDefault();

    var text = $('#post-name').val();
    app.createPost(text);
    app.renderPosts();
});

$('.posts').on('click', 'a', function() {
    app.removePost(this);
});
