const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subcategory: { type: String, default: "" },
    image: String,
    description: String,
    ingredients: [String],
    nutritionInfo: { type: String, default: "" },
    stockAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model("Food", foodSchema);