const Order = require("../models/order.model");
const Food = require("../models/food.model");

const populateOrder = (query) =>
    query.populate({ path: "foods.foodId", populate: { path: "category" } });

exports.createOrder = async (req, res) => {
    try {
        const { foods, customerName, location } = req.body;

        if (!foods || !Array.isArray(foods) || foods.length === 0) {
            return res.status(400).json({ success: false, msg: "Foods array required" });
        }

        let totalPrice = 0;
        const validFoods = [];

        for (const item of foods) {
            if (!item.foodId || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({ success: false, msg: "Invalid food items" });
            }

            const food = await Food.findById(item.foodId);
            if (!food) return res.status(404).json({ success: false, msg: `Food ${item.foodId} not found` });

            totalPrice += food.price * item.quantity;
            validFoods.push(item);
        }

        const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
        const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

        const order = await Order.create({
            customerName: customerName || "Anonymous",
            location: location || "London",
            foods: validFoods,
            totalPrice,
            orderNumber,
            status: "pending"
        });

        const populated = await populateOrder(Order.findById(order._id));

        const io = req.app.get("io");
        io.to("chefs").emit("new-order", {
            order: populated,
            msg: `New order #${populated.orderNumber} received`
        });

        res.status(201).json({ success: true, msg: "Order created successfully", order: populated });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

const formatOrder = (order) => ({
    _id: order._id,
    orderId: `#${order.orderNumber}`,
    orderNumber: order.orderNumber,
    date: new Date(order.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }),
    customerName: order.customerName,
    location: order.location,
    foods: order.foods,
    amount: `$${(order.totalPrice || 0).toFixed(2)}`,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt
});

exports.getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const filter = status ? { status } : {};

        const orders = await populateOrder(
            Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
        );

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            msg: "Orders retrieved",
            data: orders.map(formatOrder),
            count: orders.length,
            total
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getOrdersForCashier = async (req, res) => {
    try {
        const orders = await populateOrder(
            Order.find({ status: { $in: ["ready", "delivered", "cancelled"] } }).sort({ createdAt: -1 })
        );

        res.status(200).json({
            success: true,
            msg: "Orders retrieved",
            data: orders.map(formatOrder),
            count: orders.length
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getOrdersForAdmin = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const orders = await populateOrder(Order.find(filter).sort({ createdAt: -1 }));

        res.status(200).json({
            success: true,
            msg: "Orders retrieved",
            data: orders.map(formatOrder),
            count: orders.length
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getOrdersForChef = async (req, res) => {
    try {
        const orders = await populateOrder(
            Order.find({ status: { $in: ["pending", "cooking"] } }).sort({ createdAt: 1 })
        );

        res.status(200).json({
            success: true,
            msg: "Orders retrieved",
            data: orders.map(formatOrder),
            count: orders.length
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await populateOrder(Order.findById(req.params.id));
        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });

        res.status(200).json({ success: true, data: formatOrder(order) });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// Chef: pending → cooking
exports.cookingOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });

        if (order.status !== "pending") {
            return res.status(400).json({ success: false, msg: "Order must be pending to start cooking" });
        }

        order.status = "cooking";
        await order.save();

        const populated = await populateOrder(Order.findById(order._id));

        const io = req.app.get("io");
        io.emit("order-status-changed", { order: populated, msg: `Order #${order.orderNumber} is now cooking` });

        res.status(200).json({ success: true, msg: "Order is now cooking", order: populated });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// Chef: cooking → ready
exports.readyOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });

        if (!["cooking", "pending"].includes(order.status)) {
            return res.status(400).json({ success: false, msg: "Order must be cooking or pending to mark as ready" });
        }

        order.status = "ready";
        await order.save();

        const populated = await populateOrder(Order.findById(order._id));

        const io = req.app.get("io");
        io.to("cashiers").emit("order-ready", { order: populated, msg: `Order #${order.orderNumber} is ready!` });
        io.emit("order-status-changed", { order: populated });

        res.status(200).json({ success: true, msg: "Order marked as ready", order: populated });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// Cashier: ready → delivered
exports.deliverOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });

        if (order.status !== "ready") {
            return res.status(400).json({ success: false, msg: "Order must be ready to deliver" });
        }

        order.status = "delivered";
        await order.save();

        const populated = await populateOrder(Order.findById(order._id));

        const io = req.app.get("io");
        io.emit("order-status-changed", { order: populated, msg: `Order #${order.orderNumber} delivered!` });

        res.status(200).json({ success: true, msg: "Order delivered successfully", order: populated });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// Admin/Cashier: cancel
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });

        if (order.status === "delivered") {
            return res.status(400).json({ success: false, msg: "Cannot cancel a delivered order" });
        }

        order.status = "cancelled";
        await order.save();

        const populated = await populateOrder(Order.findById(order._id));

        const io = req.app.get("io");
        io.emit("order-status-changed", { order: populated, msg: `Order #${order.orderNumber} cancelled` });

        res.status(200).json({ success: true, msg: "Order cancelled successfully", order: populated });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};

// Admin: update status directly
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "cooking", "ready", "delivered", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, msg: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, msg: "Order not found" });

        const populated = await populateOrder(Order.findById(order._id));

        const io = req.app.get("io");
        io.emit("order-status-changed", { order: populated });

        res.status(200).json({ success: true, msg: "Order status updated", order: populated });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};
