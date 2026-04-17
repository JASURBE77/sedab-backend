const Order = require("../models/order.model");

exports.getDashboard = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const statusResult = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusCounts = statusResult.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            msg: "Dashboard summary retrieved",
            data: {
                totalOrders,
                totalRevenue: revenueResult[0]?.totalRevenue || 0,
                pendingOrders: statusCounts.pending || 0,
                cookingOrders: statusCounts.cooking || 0,
                readyOrders: statusCounts.ready || 0,
                cancelledOrders: statusCounts.cancelled || 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error: " + err.message });
    }
};