const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/chat.controller");

router.get("/", ctrl.getMessages);

module.exports = router;
