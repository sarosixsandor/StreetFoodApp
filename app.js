var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Streetfood = require("./models/streetfood");
var seedDB = require("./seeds");

//seedDB(); 
// its commented out for the sole reason that I wont be stupid enough to start appjs again
// and flood my own db with the same comments with different IDs making show.ejs now work properly

mongoose.connect("mongodb://localhost/streetfood", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// landing page route
app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - show all street food places
app.get("/streetfoods", function(req, res){
    // get streetfoods from db
    Streetfood.find({}, function(err, allStreetfoods){
        if(err){
            console.log(err);
        } else {
            res.render("index", {streetfoods: allStreetfoods});
        }
    });
});

// CREATE - add new street food place to DB
app.post("/streetfoods", function(req, res){
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
app.get("/streetfoods/new", function(req, res){
    res.render("new");
});

// SHOW - more info about one specific(id) street food place
app.get("/streetfoods/:id", function(req, res){
    Streetfood.findById(req.params.id).populate("comments").exec(function(err, foundStreetfood){
        if(err){
            console.log(err);
        } else {
            res.render("show", {streetfood: foundStreetfood});
        }
    });
});

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});