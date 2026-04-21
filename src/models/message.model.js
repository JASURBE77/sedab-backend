const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: { type: String, default: "general" },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    avatar: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
