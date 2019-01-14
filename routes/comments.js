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
                    // add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    streetfood.comments.push(comment);
                    streetfood.save();
                    res.redirect("/streetfoods/" + streetfood._id);
                }
            });
        }
    });
});

// Comments - Edit
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {streetfood_id: req.params.id, comment: foundComment});
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