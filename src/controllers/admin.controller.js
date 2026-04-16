const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const Order = require("../models/order.model");
const Chef = require("../models/chef.model");
const Food = require("../models/food.model");
const Category = require("../models/category.model");

// ✅ admin yaratish
exports.createAdmin = async (req, res) => {
    try {
        const { name, surname, login, password } = req.body;

        if (!name || !surname || !login || !password) {
            return res.status(400).json({ success: false, msg: "All fields required" });
        }

        const existing = await Admin.findOne({ login });
        if (existing) return res.status(400).json({ success: false, msg: "Login already exists" });

        const hash = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            name,
            surname,
            login,
            password: hash
        });

        res.status(201).json({ success: true, msg: "Admin created successfully", admin });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};


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

exports.getStaff = async (req, res) => {
    try {
        const chefs = await Chef.find({}, '-password');
        
        const staffData = {
            chefs: chefs.map(c => ({...c.toObject(), role: 'chef'})),
            totalChefs: chefs.length
        };
        
        res.status(200).json({ success: true, msg: "Staff retrieved", data: staffData });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// 🌱 test data qo'shish
exports.seedData = async (req, res) => {
    try {
        // Category yaratish
        const categories = await Category.find();
        if (categories.length === 0) {
            await Category.create([
                { name: "Fast Food" },
                { name: "Drinks" },
                { name: "Desserts" }
            ]);
        }

        // Food yaratish
        const foods = await Food.find();
        if (foods.length === 0) {
            const fastFoodCat = await Category.findOne({ name: "Fast Food" });
            const drinksCat = await Category.findOne({ name: "Drinks" });
            const dessertsCat = await Category.findOne({ name: "Desserts" });

            await Food.create([
                { name: "Burger", price: 15000, category: fastFoodCat._id },
                { name: "Pizza", price: 25000, category: fastFoodCat._id },
                { name: "Coke", price: 5000, category: drinksCat._id },
                { name: "Ice Cream", price: 8000, category: dessertsCat._id }
            ]);
        }

        // Order yaratish
        const orders = await Order.find();
        if (orders.length === 0) {
            const burger = await Food.findOne({ name: "Burger" });
            const pizza = await Food.findOne({ name: "Pizza" });
            const coke = await Food.findOne({ name: "Coke" });

            await Order.create([
                {
                    customerName: "John Doe",
                    foods: [
                        { foodId: burger._id, quantity: 2 },
                        { foodId: coke._id, quantity: 1 }
                    ],
                    totalPrice: 35000,
                    orderNumber: 1,
                    status: "pending"
                },
                {
                    customerName: "Jane Smith",
                    foods: [
                        { foodId: pizza._id, quantity: 1 },
                        { foodId: coke._id, quantity: 2 }
                    ],
                    totalPrice: 35000,
                    orderNumber: 2,
                    status: "ready"
                },
                {
                    customerName: "Bob Johnson",
                    foods: [
                        { foodId: burger._id, quantity: 1 },
                        { foodId: pizza._id, quantity: 1 }
                    ],
                    totalPrice: 40000,
                    orderNumber: 3,
                    status: "cooking"
                }
            ]);
        }

        res.status(200).json({ success: true, msg: "Test data seeded successfully" });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// 📊 statistika
exports.getStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const readyOrders = await Order.countDocuments({ status: "ready" });

        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const topFoods = await Order.aggregate([
            { $unwind: "$foods" },
            {
                $group: {
                    _id: "$foods.foodId",
                    count: { $sum: "$foods.quantity" }
                }
            },
            { $lookup: { from: "foods", localField: "_id", foreignField: "_id", as: "food" } },
            { $unwind: "$food" },
            { $project: { name: "$food.name", count: 1 } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const chefs = await Chef.countDocuments();

        const stats = {
            totalOrders,
            pendingOrders,
            readyOrders,
            revenue: totalRevenue[0]?.total || 0,
            topFoods,
            totalChefs: chefs
        };

        res.status(200).json({ success: true, msg: "Statistics retrieved", data: stats });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};