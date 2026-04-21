const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/dashboard.controller");

router.get("/", ctrl.getDashboard);
router.get("/PieChart", ctrl.getPieChart);
router.get("/OrderChart", ctrl.getOrderChart);
router.get("/RevenueChart", ctrl.getRevenueChart);
router.get("/CustomerMap", ctrl.getCustomerMap);
router.get("/CustomerReviews", ctrl.getCustomerReviews);

module.exports = router;
