module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
};
