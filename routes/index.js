module.exports = function (app) {
    app.get('/', function(req, res) {
        res.redirect('/posts');
    });
    app.use('/signin', require('./signin'));
    app.use('/signup', require('./signup'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));
}
