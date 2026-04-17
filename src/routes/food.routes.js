const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food.controller");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const upload = require("../middleware/upload");

router.post("/", auth, role("admin"), upload.single("image"), foodController.createFood);

router.get("/", foodController.getFoods);

router.get("/:id", foodController.getFood);

router.put("/:id", auth, role("admin"), upload.single("image"), foodController.updateFood);

router.delete("/:id", auth, role("admin"), foodController.deleteFood);

module.exports = router;