var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Streetfood = require("./models/streetfood");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var User = require("./models/user");

var commentRoutes = require("./routes/comments");
var streetfoodRoutes = require("./routes/streetfoods");
var indexRoutes = require("./routes/index");

//seedDB();
mongoose.connect("mongodb://localhost/streetfood", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// Passport Configuration
app.use(require("express-session")({
    secret: "secretsecretsecret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass current user to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(commentRoutes);
app.use(streetfoodRoutes);
app.use(indexRoutes);

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});