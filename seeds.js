var mongoose = require("mongoose");
var Streetfood = require("./models/streetfood");
var Comment = require("./models/comment");

var data = [
    {
        name: "ZING",
        image: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/2_zing_gaszromobil.hu_.jpg",
        description: "woifjeawoijfewoiefj"
    },
    {
        name: "PANEER",
        image: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/3_paneer_bebudapest.hu_.jpg",
        description: "woifjeawoijfewoiefj"
    },
    {
        name: "CUPÁKOS",
        image: "https://dhalbm0yebhbn.cloudfront.net/wp-content/uploads/2016/05/cupakos.jpg",
        description: "woifjeawoijfewoiefj"
    }
];

function seedDB(){
    // remove all street food places
    Streetfood.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed streetfoods!");
        // add a few street food places
        data.forEach(function(seed){
            Streetfood.create(seed, function(err, streetfood){
                if(err) {
                    console.log(err);
                } else {
                    console.log("added a street food place!");
                    // add a few comments
                    Comment.create({
                        text: "Great place!",
                        author: "Sanyi"
                    }, function(err, comment){
                        if(err) {
                            console.log(err);
                        } else {
                            streetfood.comments.push(comment);
                            streetfood.save();
                            console.log("created new comment");
                        }
                    });
                }
            });
        });
    });
};

module.exports = seedDB;