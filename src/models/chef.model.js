const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
    name: String,
    surname: String,
    login: { type: String, unique: true },
    password: String,
    phone: String,
    age: Number,
    salary: Number,
    role: {
        type: String,
        enum: ["chef"],
        default: "chef"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Chef", chefSchema);