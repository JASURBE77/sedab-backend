const Food = require("../models/food.model");

const getImageUrl = (req, filename) => {
    if (!filename) return null;
    // Agar URL bo'lsa, to'g'ridan-to'g'ri qaytarish
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }
    // Agar filename bo'lsa, path bilan qaytarish
    return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

exports.createFood = async (req, res) => {
    try {
        const { name, price, category, description, ingredients, imageUrl } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, msg: "Name, price, and category required" });
        }

        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ success: false, msg: "Price must be a positive number" });
        }

        // Image: file upload yoki string URL
        const image = imageUrl || req.file?.filename || null;

        const food = await Food.create({
            name,
            price: parseFloat(price),
            category,
            image,
            description,
            ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : []
        });

        const responseFood = food.toObject();
        responseFood.image = getImageUrl(req, food.image);

        res.status(201).json({ success: true, msg: "Food created successfully", food: responseFood });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// 📋 hamma foodlar
exports.getFoods = async (req, res) => {
    try {
        const foods = await Food.find().populate('category');
        const formatted = foods.map((food) => {
            const obj = food.toObject();
            // Agar URL bo'lsa, to'g'ridan-to'g'ri qaytarish
            if (obj.image && (obj.image.startsWith('http://') || obj.image.startsWith('https://'))) {
                obj.image = obj.image;
            } else {
                obj.image = getImageUrl(req, obj.image);
            }
            return obj;
        });

        res.status(200).json({ success: true, msg: "Foods retrieved", data: formatted, count: formatted.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// 📋 bitta food
exports.getFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findById(id).populate('category');
        if (!food) return res.status(404).json({ success: false, msg: "Food not found" });

        const obj = food.toObject();
        // Agar URL bo'lsa, to'g'ridan-to'g'ri qaytarish
        if (obj.image && (obj.image.startsWith('http://') || obj.image.startsWith('https://'))) {
            obj.image = obj.image;
        } else {
            obj.image = getImageUrl(req, obj.image);
        }

        res.status(200).json({ success: true, msg: "Food retrieved", data: obj });
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
        const { name, price, category, description, ingredients } = req.body;

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
            image: req.file ? req.file.filename : undefined,
            description,
            ingredients: ingredients ? ingredients.split(',').map(i => i.trim()) : undefined
        }, { new: true });

        if (!food) return res.status(404).json({ success: false, msg: "Food not found" });

        const responseFood = food.toObject();
        responseFood.image = getImageUrl(req, responseFood.image);

        res.status(200).json({ success: true, msg: "Food updated successfully", food: responseFood });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};