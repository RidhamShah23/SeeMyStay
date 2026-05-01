const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// REGISTER FORM
router.get("/register", (req, res) => {
    res.render("users/register");
});

// REGISTER LOGIC
router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to SeeMyStay!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

// LOGIN FORM
router.get("/login", (req, res) => {
    res.render("users/login");
});

// LOGIN LOGIC
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        const redirectUrl = req.session.redirectUrl || "/listings";
        delete req.session.redirectUrl;

        req.flash("success", "Welcome back!");
        res.redirect(redirectUrl);
    }
);

// LOGOUT
router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
});

module.exports = router;

