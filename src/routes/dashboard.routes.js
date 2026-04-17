const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/",  dashboardController.getDashboard);

module.exports = router;
