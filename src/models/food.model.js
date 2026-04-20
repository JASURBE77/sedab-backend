const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    image: String, // rasm path yoki URL
    description: String,
    ingredients: [String] // ingredientlar ro'yxati
});

module.exports = mongoose.model("Food", foodSchema);