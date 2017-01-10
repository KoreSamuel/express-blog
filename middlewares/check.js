module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', 'not login');
            return res.redirect('/signin');
        }
        next();
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', 'logined');
            return res.redirect('back');
        }
        next()
    }
};
