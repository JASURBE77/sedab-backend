const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subcategory: { type: String, default: "" },
    image: { type: String, default: "" , required: true },
    description: { type: String, default: ""  , required: true },
    ingredients: [String],
    nutritionInfo: { type: String, default: "" },
    stockAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model("Food", foodSchema);