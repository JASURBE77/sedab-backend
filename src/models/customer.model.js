const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    balance: { type: Number, default: 0 },
    avatar: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
