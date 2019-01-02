var mongoose = require("mongoose");

// schema setup (blueprint)
var streetfoodSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ]
});

// compile into model and require it in app.js
module.exports = mongoose.model("Streetfood", streetfoodSchema);