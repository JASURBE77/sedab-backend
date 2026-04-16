const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// admin yaratish
router.post("/", adminController.createAdmin);

// chef yaratish
router.post("/chef", auth, role("admin"), adminController.createChef);

// seed data
router.post("/seed", auth, role("admin"), adminController.seedData);

// statistika
router.get("/stats", auth, role("admin"), adminController.getStats);

// staff ma'lumotlari
router.get("/staff", auth, role("admin"), adminController.getStaff);

module.exports = router;