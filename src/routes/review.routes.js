const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/review.controller");

router.get("/", ctrl.getReviews);
router.post("/", ctrl.createReview);
router.delete("/:id", ctrl.deleteReview);

module.exports = router;
