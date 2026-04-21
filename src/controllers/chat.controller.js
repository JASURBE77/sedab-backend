const Message = require("../models/message.model");

exports.getMessages = async (req, res) => {
    try {
        const { room = "general" } = req.query;
        const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(100);
        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
