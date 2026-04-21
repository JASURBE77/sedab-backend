const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, default: null },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", default: null },
    foodImage: { type: String, default: null },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
