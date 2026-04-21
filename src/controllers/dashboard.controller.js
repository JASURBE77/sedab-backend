const Order = require("../models/order.model");
const Food = require("../models/food.model");
const Chef = require("../models/chef.model");
const Cashier = require("../models/cashier.model");
const Customer = require("../models/customer.model");
const Review = require("../models/review.model");

/* ── GET /api/Dashboard ───────────────────────────────────────── */
exports.getDashboard = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const readyOrders = await Order.countDocuments({ status: { $in: ["ready", "delivered"] } });
        const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

        const revenueResult = await Order.aggregate([
            { $match: { status: { $in: ["ready", "delivered"] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        res.json({
            success: true,
            data: { totalOrders, totalRevenue, readyOrders, cancelledOrders }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

/* ── GET /api/Dashboard/PieChart ──────────────────────────────── */
exports.getPieChart = async (req, res) => {
    try {
        const total = await Order.countDocuments();
        const completed = await Order.countDocuments({ status: { $in: ["ready", "delivered"] } });

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const newCustomers = await Customer.countDocuments({ createdAt: { $gte: lastMonth } });
        const allCustomers = await Customer.countDocuments();

        const revenueResult = await Order.aggregate([
            { $match: { status: { $in: ["ready", "delivered"] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const revenue = revenueResult[0]?.total || 0;
        const revenueTarget = 1000000;

        const totalOrderPercent = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;
        const customerGrowthPercent = allCustomers > 0 ? Math.min(Math.round((newCustomers / allCustomers) * 100), 100) : 0;
        const totalRevenuePercent = Math.min(Math.round((revenue / revenueTarget) * 100), 100);

        res.json({ success: true, data: { totalOrderPercent, customerGrowthPercent, totalRevenuePercent } });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

/* ── GET /api/Dashboard/OrderChart ───────────────────────────── */
exports.getOrderChart = async (req, res) => {
    try {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const result = await Order.aggregate([
            { $match: { createdAt: { $gte: weekAgo } } },
            { $group: { _id: { $dayOfWeek: "$createdAt" }, orders: { $sum: 1 } } }
        ]);

        const map = {};
        result.forEach(r => { map[r._id] = r.orders; });

        const data = days.map((day, i) => ({ day, orders: map[i + 1] || 0 }));

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

/* ── GET /api/Dashboard/RevenueChart ─────────────────────────── */
exports.getRevenueChart = async (req, res) => {
    try {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        const prevYear = currentYear - 1;

        const result = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["ready", "delivered"] },
                    createdAt: { $gte: new Date(`${prevYear}-01-01`) }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const data = months.map((month, i) => {
            const y2020 = result.find(r => r._id.year === prevYear && r._id.month === i + 1)?.revenue || 0;
            const y2021 = result.find(r => r._id.year === currentYear && r._id.month === i + 1)?.revenue || 0;
            return { month, y2020, y2021 };
        });

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

/* ── GET /api/Dashboard/CustomerMap ──────────────────────────── */
exports.getCustomerMap = async (req, res) => {
    try {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [custResult, orderResult] = await Promise.all([
            Customer.aggregate([
                { $match: { createdAt: { $gte: weekAgo } } },
                { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: weekAgo } } },
                { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
            ])
        ]);

        const custMap = {};
        custResult.forEach(r => { custMap[r._id] = r.count; });
        const ordMap = {};
        orderResult.forEach(r => { ordMap[r._id] = r.count; });

        const data = days.map((day, i) => ({
            day,
            red: custMap[i + 1] || 0,
            yellow: ordMap[i + 1] || 0
        }));

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

/* ── GET /api/Dashboard/CustomerReviews ──────────────────────── */
exports.getCustomerReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);

        const data = reviews.map(r => ({
            name: r.name,
            date: new Date(r.createdAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
            }),
            image: r.image || null,
            text: r.text,
            rating: r.rating,
            foodImage: r.foodImage || null,
        }));

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
