const Category = require("../models/category.model");

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, msg: "Category name required" });
        }

        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).json({ success: false, msg: "Category already exists" });

        const category = await Category.create({ name });
        res.status(201).json({ success: true, msg: "Category created successfully", category });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, msg: "Categories retrieved", data: categories, count: categories.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};