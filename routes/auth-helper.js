// auth middleware
module.exports = (req, res, next) => {
    // User session is not exist
    if (!req.session.user) {
        // Remove user info from res.locals
        delete res.locals.user;

        res.redirect('/login');
        // this 'return' more acts like 'stop'
        return;
    }

    // ★ Make user info available in view files
    res.locals.user = req.session.user;

    next();
};