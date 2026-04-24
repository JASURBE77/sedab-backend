const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
    name: String,
    surname: String,
    fullname: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    login: { type: String, unique: true },
    password: String,
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