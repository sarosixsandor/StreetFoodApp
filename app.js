var express = require("express");
var app = express();
var mongoose = require("mongoose");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Streetfood = require("./models/streetfood");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var User = require("./models/user");

// Requiring routes
var commentRoutes = require("./routes/comments");
var streetfoodRoutes = require("./routes/streetfoods");
var indexRoutes = require("./routes/index");

// seedDB(); // seed the DB with posts and comments
mongoose.connect("mongodb://localhost/streetfood", { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
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

// Pass current user, error and success messages to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/streetfoods", streetfoodRoutes);
app.use("/streetfoods/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});