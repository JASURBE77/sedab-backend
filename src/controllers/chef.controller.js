const bcrypt = require("bcrypt");
const Chef = require("../models/chef.model");

exports.createChef = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);

        const chef = await Chef.create({
            ...req.body,
            password: hash
        });

        res.json(chef);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};