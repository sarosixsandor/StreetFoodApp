var express = require("express");
var app = express();

app.set("view engine", "ejs")

// landing page route
app.get("/", function(req, res){
    res.render("landing");
});

//street food places route
app.get("/streetfoods", function(req, res){
    //temporary array
    var streetfoods = [
        {name: "ZING", picture: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/2_zing_gaszromobil.hu_.jpg"},
        {name: "PANEER", picture: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/3_paneer_bebudapest.hu_.jpg"}
    ];
    res.render("streetfoods");
});

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});