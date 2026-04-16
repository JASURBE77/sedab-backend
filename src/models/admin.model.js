const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    login: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    }
});

module.exports = mongoose.model("Admin", adminSchema);