const Chef = require("../models/chef.model");

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ success: false, msg: "id query param required" });

        const chef = await Chef.findById(id).select("-password");
        if (!chef) return res.status(404).json({ success: false, msg: "Chef not found" });

        res.status(200).json({ success: true, data: chef });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};
