var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req, res){
    res.render("landing");
});

// Register Form route
router.get("/register", function(req, res){
    res.render("register");
});

// Handles Sign Up Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the site " + user.username + "!");
            res.redirect("/streetfoods");
        });
    });
});

// Login Form route
router.get("/login", function(req, res){
    res.render("login");
});

// Handles Login Form logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/streetfoods",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome!" 
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/streetfoods");
});

module.exports = router;