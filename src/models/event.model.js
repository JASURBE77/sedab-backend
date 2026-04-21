const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title:     { type: String, required: true },
    date:      { type: String, required: true }, // "YYYY-MM-DD"
    startTime: { type: String, default: "09:00" },
    endTime:   { type: String, default: "10:00" },
    color:     { type: String, default: "teal" },
    allDay:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
