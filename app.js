var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/streetfood", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema setup (blueprint)
var streetfoodSchema = new mongoose.Schema({
    name: String,
    image: String
});

// compile into model
var Streetfood = mongoose.model("Streetfood", streetfoodSchema);

// landing page route
app.get("/", function(req, res){
    res.render("landing");
});

// street food places route
app.get("/streetfoods", function(req, res){
    // get streetfoods from db
    Streetfood.find({}, function(err, allStreetfoods){
        if(err){
            console.log(err);
        } else {
            res.render("streetfoods", {streetfoods: allStreetfoods});
        }
    });
});

// REST post route to street food places
app.post("/streetfoods", function(req, res){
    // get data from form and add to streetfoods[]
    var name = req.body.name;
    var image = req.body.image;
    var newStreetfoodplace = {name: name, image: image};
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

app.get("/streetfoods/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});