const mongoose = require("mongoose");
const Order = require("../models/order.model");
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const seedOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        // Delete all existing orders
        const deletedCount = await Order.deleteMany({});
        console.log(`🗑️ Deleted ${deletedCount.deletedCount} existing orders`);

        // Mock orders data (rasm bo'yicha)
        const ordersData = [
            {
                customerName: "Mikasa Ackerman",
                location: "Corner Street 5th London",
                orderNumber: 555231,
                totalPrice: 184.52,
                status: "New Order",
                createdAt: new Date("2020-03-26T00:42:00")
            },
            {
                customerName: "Eren Yeager",
                location: "John's Road London B71",
                orderNumber: 555232,
                totalPrice: 184.52,
                status: "On Delivery",
                createdAt: new Date("2020-03-26T11:42:00")
            },
            {
                customerName: "Grisha Yeager",
                location: "31 The Green London",
                orderNumber: 555233,
                totalPrice: 356.52,
                status: "Delivered",
                createdAt: new Date("2020-03-26T00:22:00")
            },
            {
                customerName: "Historia Reass",
                location: "11 Church Road London",
                orderNumber: 555234,
                totalPrice: 184.52,
                status: "New Order",
                createdAt: new Date("2020-03-26T10:42:00")
            },
            {
                customerName: "Levi Ackerman",
                location: "21 King Street London",
                orderNumber: 555235,
                totalPrice: 564.52,
                status: "On Delivery",
                createdAt: new Date("2020-03-26T00:00:00")
            },
            {
                customerName: "Armin Melaney",
                location: "14 The Drive London",
                orderNumber: 555236,
                totalPrice: 186.52,
                status: "New Order",
                createdAt: new Date("2020-03-26T13:42:00")
            },
            {
                customerName: "Ronald Jamez",
                location: "89 Station's Road London",
                orderNumber: 555237,
                totalPrice: 184.00,
                status: "New Order",
                createdAt: new Date("2020-03-26T16:42:00")
            }
        ];

        // Insert new orders
        const insertedOrders = await Order.insertMany(ordersData);
        console.log(`✅ Successfully inserted ${insertedOrders.length} orders`);

        // Show what we inserted
        console.log("\n📋 Inserted Orders:");
        insertedOrders.forEach(order => {
            console.log(`   #${order.orderNumber} - ${order.customerName} - ${order.status}`);
        });

        await mongoose.disconnect();
        console.log("\n✅ Seed completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed error:", err.message);
        process.exit(1);
    }
};

seedOrders();
