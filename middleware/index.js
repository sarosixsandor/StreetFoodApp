var Streetfood = require("../models/streetfood");
var Comment = require("../models/comment");

// all the middleware will be here
var middlewareObj = {};

middlewareObj.checkStreetfoodOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Streetfood.findById(req.params.id, function(err, foundStreetfood){
            if(err || !foundStreetfood){
                req.flash("error", "Street Food not found!");
                res.redirect("back");
            } else {
                // does user own the street food post?
                if (foundStreetfood.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("errorr", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj