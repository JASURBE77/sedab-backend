const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/order.controller");

router.post("/", ctrl.createOrder);
router.get("/", ctrl.getOrders);
router.get("/chef", ctrl.getOrdersForChef);
router.get("/cashier", ctrl.getOrdersForCashier);
router.get("/admin", ctrl.getOrdersForAdmin);
router.get("/:id", ctrl.getOrderById);

router.put("/:id/cooking", ctrl.cookingOrder);
router.put("/:id/ready", ctrl.readyOrder);
router.put("/:id/deliver", ctrl.deliverOrder);
router.put("/:id/status", ctrl.updateOrderStatus);
router.put("/:id/cancel", ctrl.cancelOrder);

module.exports = router;
