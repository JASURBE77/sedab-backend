const Event = require("../models/event.model");

exports.getEvents = async (req, res) => {
    try {
        const { month, year } = req.query;
        const filter = {};
        if (month && year) {
            const m = String(month).padStart(2, "0");
            filter.date = { $regex: `^${year}-${m}` };
        }
        const events = await Event.find(filter).sort({ date: 1, startTime: 1 });
        res.json({ success: true, data: events });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, date, startTime, endTime, color, allDay } = req.body;
        if (!title || !date) return res.status(400).json({ success: false, msg: "title and date required" });

        const event = await Event.create({ title, date, startTime, endTime, color, allDay });
        res.status(201).json({ success: true, msg: "Event created", event });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ success: false, msg: "Event not found" });
        res.json({ success: true, msg: "Event updated", event });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ success: false, msg: "Event not found" });
        res.json({ success: true, msg: "Event deleted" });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
