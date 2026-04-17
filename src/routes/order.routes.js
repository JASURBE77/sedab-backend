const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// 💵 user order yaratadi
router.post("/", orderController.createOrder);

// 👨‍🍳 chef orderlarni ko‘radi
router.get("/", auth, role("chef"), orderController.getOrders);

// � cashier order statuslarini ko‘radi
router.get("/cashier", auth, role("cashier"), orderController.getOrdersForCashier);

// 👑 admin orderlarni ko‘radi
router.get("/admin", auth, role("admin"), orderController.getOrdersForAdmin);

// �👨‍🍳 chef orderni tayyor qiladi
router.put("/:id/ready", auth, role("chef"), orderController.readyOrder);

// ❌ orderni bekor qiladi
router.put("/:id/cancel", auth, role("admin", "cashier"), orderController.cancelOrder);

module.exports = router;