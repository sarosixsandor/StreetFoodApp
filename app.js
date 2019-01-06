var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Streetfood = require("./models/streetfood");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

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

// pass current user to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("streetfoods/index", {streetfoods: allStreetfoods, currentUser: req.user});
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
    res.render("streetfoods/new");
});

// SHOW - more info about one specific(id) street food place
app.get("/streetfoods/:id", function(req, res){
    Streetfood.findById(req.params.id).populate("comments").exec(function(err, foundStreetfood){
        if(err){
            console.log(err);
        } else {
            res.render("streetfoods/show", {streetfood: foundStreetfood});
        }
    });
});

// COMMENT ROUTES
app.get("/streetfoods/:id/comments/new", isLoggedIn, function(req, res){
    Streetfood.findById(req.params.id, function(err, streetfood){
        if(err){
            console.log(err);
            res.redirect
        } else {
            res.render("comments/new", {streetfood: streetfood});
        }
    })
});

app.post("/streetfoods/:id/comments", isLoggedIn, function(req, res){
    Streetfood.findById(req.params.id, function(err, streetfood){
        if(err){
            console.log(err);
            res.redirect("/streetfoods");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    streetfood.comments.push(comment);
                    streetfood.save();
                    res.redirect("/streetfoods/" + streetfood._id);
                }
            });
        }
    });
});

// ===========
// Auth routes
// ===========

// Show register form
app.get("/register", function(req, res){
    res.render("register");
});

// Handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/streetfoods");
        });
    });
});

// Show login form
app.get("/login", function(req, res){
    res.render("login");
});

// Handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/streetfoods",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/streetfoods");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

app.listen(3000, function(){
    console.log("The Street Food App server is now listening on port: 3000");
});