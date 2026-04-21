const Food = require("../models/food.model");

const getImageUrl = (req, filename) => {
    if (!filename) return null;
    if (filename.startsWith("http://") || filename.startsWith("https://")) return filename;
    return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

exports.createFood = async (req, res) => {
    try {
        const { name, price, category, description, ingredients, imageUrl, subcategory, nutritionInfo, stockAvailable } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, msg: "Name, price, and category required" });
        }

        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ success: false, msg: "Price must be a positive number" });
        }

        const image = imageUrl || req.file?.filename || null;

        const food = await Food.create({
            name,
            price: parseFloat(price),
            category,
            subcategory: subcategory || "",
            image,
            description: description || "",
            ingredients: ingredients ? (Array.isArray(ingredients) ? ingredients : ingredients.split(",").map(i => i.trim())) : [],
            nutritionInfo: nutritionInfo || "",
            stockAvailable: stockAvailable !== undefined ? stockAvailable : true,
        });

        await food.populate("category");
        const obj = food.toObject();
        obj.image = getImageUrl(req, food.image);

        res.status(201).json({ success: true, msg: "Food created successfully", food: obj });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getFoods = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (search) filter.name = { $regex: search, $options: "i" };

        const foods = await Food.find(filter).populate("category");
        const data = foods.map(food => {
            const obj = food.toObject();
            if (obj.image && (obj.image.startsWith("http://") || obj.image.startsWith("https://"))) {
                // URL as-is
            } else {
                obj.image = getImageUrl(req, obj.image);
            }
            return obj;
        });

        res.status(200).json({ success: true, msg: "Foods retrieved", data, count: data.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate("category");
        if (!food) return res.status(404).json({ success: false, msg: "Food not found" });

        const obj = food.toObject();
        if (!(obj.image && (obj.image.startsWith("http://") || obj.image.startsWith("https://")))) {
            obj.image = getImageUrl(req, obj.image);
        }

        res.status(200).json({ success: true, msg: "Food retrieved", data: obj });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const { name, price, category, description, ingredients, subcategory, nutritionInfo, stockAvailable } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, msg: "Name, price, and category required" });
        }

        const updateData = {
            name,
            price: parseFloat(price),
            category,
            subcategory: subcategory || "",
            description: description || "",
            nutritionInfo: nutritionInfo || "",
            stockAvailable: stockAvailable !== undefined ? stockAvailable : true,
        };

        if (ingredients) {
            updateData.ingredients = Array.isArray(ingredients) ? ingredients : ingredients.split(",").map(i => i.trim());
        }

        if (req.file) updateData.image = req.file.filename;

        const food = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate("category");
        if (!food) return res.status(404).json({ success: false, msg: "Food not found" });

        const obj = food.toObject();
        if (!(obj.image && (obj.image.startsWith("http://") || obj.image.startsWith("https://")))) {
            obj.image = getImageUrl(req, obj.image);
        }

        res.status(200).json({ success: true, msg: "Food updated successfully", food: obj });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) return res.status(404).json({ success: false, msg: "Food not found" });

        res.status(200).json({ success: true, msg: "Food deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};
