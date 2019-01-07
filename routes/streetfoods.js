var express = require("express");
var router = express.Router();
var Streetfood = require("../models/streetfood");

// INDEX - show all street food places
router.get("/", function(req, res){
    // get streetfoods from db
    Streetfood.find({}, function(err, allStreetfoods){
        if(err){
            console.log(err);
        } else {
            res.render("streetfoods/index", {streetfoods: allStreetfoods, currentUser: req.user});
        }
    });
});

// CREATE - add new street food place to DB
router.post("/", function(req, res){
    // get data from form and add to streetfoods[]
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newStreetfoodplace = {name: name, image: image, description: desc};
    // create a new steetfood place and save to db
    Streetfood.create(newStreetfoodplace, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to streetfoods page
            // we have two "/streetfoods", but the default is a "GET" request
            // so it redirects us to the right page
            res.redirect("/streetfoods");
        }
    });
});

// NEW - display form to create new street food place
router.get("/new", function(req, res){
    res.render("streetfoods/new");
});

// SHOW - more info about one specific(id) street food place
router.get("/:id", function(req, res){
    Streetfood.findById(req.params.id).populate("comments").exec(function(err, foundStreetfood){
        if(err){
            console.log(err);
        } else {
            res.render("streetfoods/show", {streetfood: foundStreetfood});
        }
    });
});

module.exports = router;