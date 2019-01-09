var mongoose = require("mongoose");

// schema setup (blueprint)
var streetfoodSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// compile into model and require it in app.js
module.exports = mongoose.model("Streetfood", streetfoodSchema);