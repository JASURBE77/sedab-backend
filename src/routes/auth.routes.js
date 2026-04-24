const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

router.post("/register", authController.createAdmin);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.put("/me", authMiddleware, authController.updateProfile);
router.put("/me/password", authMiddleware, authController.updatePassword);

module.exports = router;