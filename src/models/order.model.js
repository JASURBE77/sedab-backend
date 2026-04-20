const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        default: "Anonymous"
    },
    location: {
        type: String,
        default: "London"
    },
    foods: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
            quantity: Number
        }
    ],
    totalPrice: Number,
    orderNumber: Number,
    status: {
        type: String,
        enum: ["pending", "cooking", "ready", "cancelled", "New Order", "On Delivery", "Delivered", "Cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);