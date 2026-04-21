const Transaction = require("../models/transaction.model");
const Order       = require("../models/order.model");

exports.getWallet = async (req, res) => {
    try {
        // Manuel transactionlar
        const transactions = await Transaction.find().sort({ createdAt: -1 });

        // Orderlardan avtomatik daromad (delivered/ready statusdagi orderlar)
        const orderRevenue = await Order.aggregate([
            { $match: { status: { $in: ["delivered", "ready"] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        // Eng ko'p sotilgan taomlar
        const topFoods = await Order.aggregate([
            { $match: { status: { $in: ["delivered", "ready"] } } },
            { $unwind: "$foods" },
            { $group: { _id: "$foods.foodId", totalQty: { $sum: "$foods.quantity" } } },
            { $lookup: { from: "foods", localField: "_id", foreignField: "_id", as: "food" } },
            { $unwind: "$food" },
            { $project: { name: "$food.name", price: "$food.price", totalQty: 1, revenue: { $multiply: ["$food.price", "$totalQty"] } } },
            { $sort: { totalQty: -1 } },
            { $limit: 5 }
        ]);

        // Oylik daromad (so'nggi 6 oy)
        const monthlyRevenue = await Order.aggregate([
            { $match: { status: { $in: ["delivered", "ready"] } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 }
        ]);

        const manualIncome  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const manualExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        const orderIncome   = orderRevenue[0]?.total || 0;
        const totalIncome   = manualIncome + orderIncome;
        const balance       = totalIncome - manualExpense;

        res.json({
            success: true,
            data: {
                balance,
                income: totalIncome,
                orderIncome,
                manualIncome,
                expense: manualExpense,
                transactions,
                topFoods,
                monthlyRevenue: monthlyRevenue.reverse(),
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, description, category } = req.body;

        if (!type || !amount || !description) {
            return res.status(400).json({ success: false, msg: "type, amount, description required" });
        }

        const tx = await Transaction.create({ type, amount, description, category });
        res.status(201).json({ success: true, msg: "Transaction created", transaction: tx });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const tx = await Transaction.findByIdAndDelete(req.params.id);
        if (!tx) return res.status(404).json({ success: false, msg: "Not found" });
        res.json({ success: true, msg: "Transaction deleted" });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
