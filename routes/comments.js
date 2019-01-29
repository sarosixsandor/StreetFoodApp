var express = require("express");
var router = express.Router({mergeParams: true});
var Streetfood = require("../models/streetfood");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments - New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Streetfood.findById(req.params.id, function(err, streetfood){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {streetfood: streetfood});
        }
    })
});

// Comments - Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Streetfood.findById(req.params.id, function(err, streetfood){
        if(err){
            console.log(err);
            res.redirect("/streetfoods");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    // add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    streetfood.comments.push(comment);
                    streetfood.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/streetfoods/" + streetfood._id);
                }
            });
        }
    });
});

// Comments - Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Streetfood.findById(req.params.id, function(err, foundStreetfood){
        if (err || !foundStreetfood){
            req.flash("error", "Street Food not found!");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {streetfood_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// Comments - Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/streetfoods/" + req.params.id);
        }
    });
});

// Comments - Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/streetfoods/" + req.params.id);
        }
    });
});

module.exports = router;