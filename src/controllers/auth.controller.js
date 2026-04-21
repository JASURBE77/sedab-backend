const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Admin = require("../models/admin.model");
const Chef = require("../models/chef.model");
const Cashier = require("../models/cashier.model");

const getSecret = () => process.env.JWT_SECRET || "SECRET_KEY";

exports.createAdmin = async (req, res) => {
    try {
        const { name, surname, login, password } = req.body;

        if (!name || !surname || !login || !password) {
            return res.status(400).json({ success: false, msg: "All fields required" });
        }

        const existing = await Admin.findOne({ login });
        if (existing) return res.status(400).json({ success: false, msg: "Login already exists" });

        const hash = await bcrypt.hash(password, 10);
        const admin = await Admin.create({ name, surname, login, password: hash });

        res.status(201).json({ success: true, msg: "Admin created successfully", admin });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({ success: false, msg: "Login and password required" });
        }

        const user =
            (await Admin.findOne({ login })) ||
            (await Chef.findOne({ login })) ||
            (await Cashier.findOne({ login }));

        if (!user) return res.status(404).json({ success: false, msg: "User not found" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ success: false, msg: "Wrong password" });

        const token = jwt.sign({ id: user._id, role: user.role }, getSecret(), { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            msg: "Login successful",
            token,
            role: user.role,
            user: {
                id: user._id,
                name: user.name,
                login: user.login,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};
