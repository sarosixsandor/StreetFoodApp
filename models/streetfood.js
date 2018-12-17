var mongoose = require("mongoose");

// schema setup (blueprint)
var streetfoodSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// compile into model and require it in app.js
module.exports = mongoose.model("Streetfood", streetfoodSchema);