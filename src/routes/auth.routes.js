const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// login (admin, cashier, chef hammasi uchun)
router.post("/register", authController.createAdmin)
router.post("/login", authController.login);

module.exports = router;