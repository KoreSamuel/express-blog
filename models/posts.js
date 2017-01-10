var marked = require('marked');
var Post = require('../lib/mongo').Post;

var CommentModel = require('./comments');

Post.plugin('addCommentsCount', {
    afterFind: function(posts) {
        return Promise.all(posts.map(function(post) {
            return CommentModel.getCommentsCount(post._id).then(function(commentsCount) {
                post.commentsCount = commentsCount;
                return post;
            });
        }));
    },
    afterFindOne: function(post) {
        if (post) {
            return CommentModel.getCommentsCount(post._id).then(function(count) {
                post.commentsCount = count;
                return post;
            });
        }
        return post;
    }
});

Post.plugin('contentToHtml', {
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne: function(post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

module.exports = {
    create: function create(post) {
        return Post.create(post).exec();
    },
    getPostById: function getPostById(postId) {
        return Post
            .findOne({
                _id: postId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    getPosts: function getPosts(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({
                path: 'author',
                model: 'User'
            })
            .sort({
                _id: -1
            })
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    incPv: function incPv(postId) {
        return Post
            .update({
                _id: postId
            }, {
                $inc: {
                    pv: 1
                }
            })
            .exec();
    },

    getRawPostById: function getRawPostById(postId) {
        return Post
            .findOne({
                _id: postId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .exec();
    },

    updatePostById: function updatePostById(postId, author, data) {
        return Post.update({
            author: author,
            _id: postId
        }, {
            $set: data
        }).exec();
    },

    delPostById: function delPostById(postId, author) {
        return Post.remove({
                author: author,
                _id: postId
            })
            .exec()
            .then(function(res) {
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            });
    }
};
