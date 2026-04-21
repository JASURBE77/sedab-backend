const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const Chef = require("../models/chef.model");
const Cashier = require("../models/cashier.model");
const Order = require("../models/order.model");
const Food = require("../models/food.model");
const Category = require("../models/category.model");

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

/* ========== CHEF ========== */

exports.createChef = async (req, res) => {
    try {
        const { name, surname, phone, age, salary, login, password } = req.body;

        if (!name || !login || !password) {
            return res.status(400).json({ success: false, msg: "Name, login, and password required" });
        }

        const existing = await Chef.findOne({ login });
        if (existing) return res.status(400).json({ success: false, msg: "Login already exists" });

        const hash = await bcrypt.hash(password, 10);
        const chef = await Chef.create({
            name,
            surname: surname || "",
            phone: phone || "",
            age: age || null,
            salary: salary || 0,
            login,
            password: hash
        });

        res.status(201).json({ success: true, msg: "Chef created successfully", chef });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getChefs = async (req, res) => {
    try {
        const chefs = await Chef.find({}, "-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: chefs, count: chefs.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.updateChef = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, surname, phone, age, salary, login, password } = req.body;

        const updateData = { name, surname, phone, age, salary, login };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const chef = await Chef.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        if (!chef) return res.status(404).json({ success: false, msg: "Chef not found" });

        res.status(200).json({ success: true, msg: "Chef updated successfully", chef });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.deleteChef = async (req, res) => {
    try {
        const { id } = req.params;
        const chef = await Chef.findByIdAndDelete(id);
        if (!chef) return res.status(404).json({ success: false, msg: "Chef not found" });

        res.status(200).json({ success: true, msg: "Chef deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

/* ========== CASHIER ========== */

exports.createCashier = async (req, res) => {
    try {
        const { name, surname, phone, age, salary, login, password } = req.body;

        if (!name || !login || !password) {
            return res.status(400).json({ success: false, msg: "Name, login, and password required" });
        }

        const existing = await Cashier.findOne({ login });
        if (existing) return res.status(400).json({ success: false, msg: "Login already exists" });

        const hash = await bcrypt.hash(password, 10);
        const cashier = await Cashier.create({
            name,
            surname: surname || "",
            phone: phone || "",
            age: age || null,
            salary: salary || 0,
            login,
            password: hash
        });

        res.status(201).json({ success: true, msg: "Cashier created successfully", cashier });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getCashiers = async (req, res) => {
    try {
        const cashiers = await Cashier.find({}, "-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: cashiers, count: cashiers.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.updateCashier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, surname, phone, age, salary, login, password } = req.body;

        const updateData = { name, surname, phone, age, salary, login };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const cashier = await Cashier.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        if (!cashier) return res.status(404).json({ success: false, msg: "Cashier not found" });

        res.status(200).json({ success: true, msg: "Cashier updated successfully", cashier });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.deleteCashier = async (req, res) => {
    try {
        const { id } = req.params;
        const cashier = await Cashier.findByIdAndDelete(id);
        if (!cashier) return res.status(404).json({ success: false, msg: "Cashier not found" });

        res.status(200).json({ success: true, msg: "Cashier deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

/* ========== STAFF (chefs + cashiers) ========== */

exports.getStaff = async (req, res) => {
    try {
        const chefs = await Chef.find({}, "-password");
        const cashiers = await Cashier.find({}, "-password");

        res.status(200).json({
            success: true,
            msg: "Staff retrieved",
            data: {
                chefs: chefs.map(c => ({ ...c.toObject(), role: "chef" })),
                cashiers: cashiers.map(c => ({ ...c.toObject(), role: "cashier" })),
                totalChefs: chefs.length,
                totalCashiers: cashiers.length
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

/* ========== STATS ========== */

exports.getStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const cookingOrders = await Order.countDocuments({ status: "cooking" });
        const readyOrders = await Order.countDocuments({ status: "ready" });
        const deliveredOrders = await Order.countDocuments({ status: "delivered" });
        const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

        const revenueResult = await Order.aggregate([
            { $match: { status: { $in: ["ready", "delivered"] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const topFoods = await Order.aggregate([
            { $unwind: "$foods" },
            { $group: { _id: "$foods.foodId", count: { $sum: "$foods.quantity" } } },
            { $lookup: { from: "foods", localField: "_id", foreignField: "_id", as: "food" } },
            { $unwind: "$food" },
            { $project: { name: "$food.name", count: 1 } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const totalChefs = await Chef.countDocuments();
        const totalCashiers = await Cashier.countDocuments();

        res.status(200).json({
            success: true,
            msg: "Statistics retrieved",
            data: {
                totalOrders,
                pendingOrders,
                cookingOrders,
                readyOrders,
                deliveredOrders,
                cancelledOrders,
                revenue: revenueResult[0]?.total || 0,
                topFoods,
                totalChefs,
                totalCashiers
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

/* ========== SEED DATA ========== */

exports.seedData = async (req, res) => {
    try {
        let categories = await Category.find();
        if (categories.length === 0) {
            categories = await Category.insertMany([
                { name: "Fast Food" },
                { name: "Drinks" },
                { name: "Desserts" }
            ]);
        }

        const foods = await Food.find();
        if (foods.length === 0) {
            const fastFood = categories.find(c => c.name === "Fast Food") || await Category.findOne({ name: "Fast Food" });
            const drinks = categories.find(c => c.name === "Drinks") || await Category.findOne({ name: "Drinks" });
            const desserts = categories.find(c => c.name === "Desserts") || await Category.findOne({ name: "Desserts" });

            await Food.insertMany([
                { name: "Burger", price: 15000, category: fastFood._id, description: "Classic beef burger" },
                { name: "Pizza", price: 25000, category: fastFood._id, description: "Margherita pizza" },
                { name: "Coke", price: 5000, category: drinks._id, description: "Cold Coca-Cola" },
                { name: "Ice Cream", price: 8000, category: desserts._id, description: "Vanilla ice cream" }
            ]);
        }

        res.status(200).json({ success: true, msg: "Seed data created successfully" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};
