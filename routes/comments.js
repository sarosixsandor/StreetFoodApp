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
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {streetfood_id: req.params.id, comment: foundComment});
        }
    });
});

// Comments - Update
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/streetfoods/" + req.params.id);
        }
    });
});

// Comments - Destroy
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/streetfoods/" + req.params.id);
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

function checkCommentOwnership(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;