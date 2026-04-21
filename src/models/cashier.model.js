const mongoose = require("mongoose");

const cashierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, default: "" },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    age: { type: Number, default: null },
    salary: { type: Number, default: 0 },
    role: {
        type: String,
        enum: ["cashier"],
        default: "cashier"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Cashier", cashierSchema);
