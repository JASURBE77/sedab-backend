const Food = require("../models/food.model");

exports.createFood = async (req, res) => {
    try {
        const { name, price, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, msg: "Name, price, and category required" });
        }

        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ success: false, msg: "Price must be a positive number" });
        }

        const food = await Food.create({
            name,
            price: parseFloat(price),
            category,
            image: req.file?.path || null
        });

        res.status(201).json({ success: true, msg: "Food created successfully", food });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// 📋 hamma foodlar
exports.getFoods = async (req, res) => {
    try {
        const foods = await Food.find().populate('category');
        res.status(200).json({ success: true, msg: "Foods retrieved", data: foods, count: foods.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// ❌ delete
exports.deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        
        const food = await Food.findByIdAndDelete(id);
        if (!food) return res.status(404).json({ success: false, msg: "Food not found" });
        
        res.status(200).json({ success: true, msg: "Food deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// ✏️ update
exports.updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, msg: "Name, price, and category required" });
        }

        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ success: false, msg: "Price must be a positive number" });
        }

        const food = await Food.findByIdAndUpdate(id, {
            name,
            price: parseFloat(price),
            category,
            image: req.file?.path || undefined
        }, { new: true });

        if (!food) return res.status(404).json({ success: false, msg: "Food not found" });

        res.status(200).json({ success: true, msg: "Food updated successfully", food });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};