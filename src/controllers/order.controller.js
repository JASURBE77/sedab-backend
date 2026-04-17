const Order = require("../models/order.model");
const Food = require("../models/food.model");

exports.createOrder = async (req, res) => {
    try {
        const { foods, customerName } = req.body;

        if (!foods || !Array.isArray(foods) || foods.length === 0) {
            return res.status(400).json({ success: false, msg: "Foods array required" });
        }

        let totalPrice = 0;
        const validFoods = [];

        // Narxlarni hisoblash
        for (let item of foods) {
            if (!item.foodId || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({ success: false, msg: "Invalid food items" });
            }

            const food = await Food.findById(item.foodId);
            if (!food) return res.status(404).json({ success: false, msg: `Food ${item.foodId} not found` });
            
            totalPrice += food.price * item.quantity;
            validFoods.push(item);
        }

        // Oxirgi zakaz raqamini olish
        const lastOrder = await Order.findOne().sort({ createdAt: -1 });
        const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

        const order = await Order.create({
            customerName: customerName || "Anonymous",
            foods: validFoods,
            totalPrice,
            orderNumber,
            status: "pending"
        });

        // Populate foods before sending
        const populatedOrder = await Order.findById(order._id).populate({
            path: 'foods.foodId',
            populate: { path: 'category' }
        });

        // Emit socket event to chefs
        const io = req.app.get("io");
        io.to("chefs").emit("new-order", {
            order: populatedOrder,
            msg: `New order #${populatedOrder.orderNumber} received`
        });

        res.status(201).json({ success: true, msg: "Order created successfully", order: populatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: 'foods.foodId',
            populate: { path: 'category' }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, msg: "Orders retrieved", data: orders, count: orders.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getOrdersForCashier = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: 'foods.foodId',
            populate: { path: 'category' }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, msg: "Orders retrieved", data: orders, count: orders.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getOrdersForAdmin = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: 'foods.foodId',
            populate: { path: 'category' }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, msg: "Orders retrieved", data: orders, count: orders.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.readyOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findByIdAndUpdate(id, { status: "ready" }, { new: true }).populate({
            path: 'foods.foodId',
            populate: { path: 'category' }
        });
        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });
        
        // Emit socket event to cashiers
        const io = req.app.get("io");
        io.to("cashiers").emit("order-ready", {
            order,
            msg: `Order #${order.orderNumber} is ready!`
        });

        res.status(200).json({ success: true, msg: "Order marked as ready", order });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndUpdate(id, { status: "cancelled" }, { new: true }).populate({
            path: 'foods.foodId',
            populate: { path: 'category' }
        });

        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });

        res.status(200).json({ success: true, msg: "Order cancelled successfully", order });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};