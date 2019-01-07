var express = require("express");
var router = express.Router({mergeParams: true});
var Streetfood = require("../models/streetfood");
var Comment = require("../models/comment");

// Comments - New
router.get("/new", isLoggedIn, function(req, res){
    Streetfood.findById(req.params.id, function(err, streetfood){
        if(err){
            console.log(err);
            res.redirect
        } else {
            res.render("comments/new", {streetfood: streetfood});
        }
    })
});

// Comments - Create
router.post("/", isLoggedIn, function(req, res){
    Streetfood.findById(req.params.id, function(err, streetfood){
        if(err){
            console.log(err);
            res.redirect("/streetfoods");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    streetfood.comments.push(comment);
                    streetfood.save();
                    res.redirect("/streetfoods/" + streetfood._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;