var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/streetfood", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema setup
var streetfoodSchema = new mongoose.Schema({
    name: String,
    image: String
});

// compile into model
var Streetfood = mongoose.model("Streetfood", streetfoodSchema);

Streetfood.create(
    {
        name: "ZING",
        image: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/2_zing_gaszromobil.hu_.jpg"

    }, function(err, streetfood){
        if(err){
            console.log(err);
        } else {
            console.log("Newly created streetfood place");
            console.log(streetfood);
        }
    }
);

// temporary array replaced to be global var so it can be reached
// this is only here temporarily, these will be placed in mongodb
var streetfoods = [
    {name: "ZING", image: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/2_zing_gaszromobil.hu_.jpg"},
    {name: "PANEER", image: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/3_paneer_bebudapest.hu_.jpg"}
];

// landing page route
app.get("/", function(req, res){
    res.render("landing");
});

// street food places route
app.get("/streetfoods", function(req, res){
    res.render("streetfoods", {streetfoods: streetfoods});
});

// REST post route to street food places
app.post("/streetfoods", function(req, res){
    // get data from form and add to streetfoods[]
    var name = req.body.name;
    var image = req.body.image;
    var newStreetfoodplace = {name: name, image: image};
    streetfoods.push(newStreetfoodplace);
    // redirect back to streetfoods page
    // we have two "/streetfoods", but the default is a "GET" request
    // so it redirects us to the right page
    res.redirect("/streetfoods");
});

app.get("/streetfoods/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});