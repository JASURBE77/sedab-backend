const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, role("admin"), categoryController.createCategory);

router.get("/", categoryController.getCategories);

module.exports = router;