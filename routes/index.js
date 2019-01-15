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
            console.log(err)
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
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
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/streetfoods");
});

module.exports = router;