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

exports.getMe = async (req, res) => {
    try {
        const { id, role } = req.user;

        let user;
        if (role === "admin") {
            user = await Admin.findById(id).select("-password");
        } else if (role === "chef") {
            user = await Chef.findById(id).select("-password");
        } else if (role === "cashier") {
            user = await Cashier.findById(id).select("-password");
        }

        if (!user) return res.status(404).json({ success: false, msg: "User not found" });

        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { fullname, email, phone, location } = req.body;

        const update = {};
        if (fullname !== undefined) update.fullname = fullname;
        if (email    !== undefined) update.email    = email;
        if (phone    !== undefined) update.phone    = phone;
        if (location !== undefined) update.location = location;

        let Model;
        if (role === "admin")   Model = Admin;
        else if (role === "chef")    Model = Chef;
        else if (role === "cashier") Model = Cashier;
        else return res.status(400).json({ success: false, msg: "Unknown role" });

        const user = await Model.findByIdAndUpdate(id, update, { new: true }).select("-password");
        if (!user) return res.status(404).json({ success: false, msg: "User not found" });

        res.json({ success: true, msg: "Profile updated", user });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, msg: "currentPassword and newPassword required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, msg: "New password must be at least 6 characters" });
        }

        let Model;
        if (role === "admin")        Model = Admin;
        else if (role === "chef")    Model = Chef;
        else if (role === "cashier") Model = Cashier;
        else return res.status(400).json({ success: false, msg: "Unknown role" });

        const user = await Model.findById(id);
        if (!user) return res.status(404).json({ success: false, msg: "User not found" });

        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) return res.status(400).json({ success: false, msg: "Current password is wrong" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, msg: "Password updated successfully" });
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
