const express = require("express");
const router = express.Router();

const foodController = require("../controllers/food.controller");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), foodController.createFood);
router.get("/", foodController.getFoods);
router.get("/:id", foodController.getFood);
router.put("/:id", upload.single("image"), foodController.updateFood);
router.delete("/:id", foodController.deleteFood);

module.exports = router;
