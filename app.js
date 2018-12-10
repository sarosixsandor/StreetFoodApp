var express = require("express");
var app = express();

app.get("/", function(req, res){
    res.send("Landing page.");
});

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});