const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "Other" },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
