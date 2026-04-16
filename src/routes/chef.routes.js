const express = require("express");
const router = express.Router();

const controller = require("../controllers/chef.controller");

router.post("/", controller.createChef);

module.exports = router;