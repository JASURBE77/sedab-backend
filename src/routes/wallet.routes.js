const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/wallet.controller");

router.get("/", ctrl.getWallet);
router.post("/", ctrl.createTransaction);
router.delete("/:id", ctrl.deleteTransaction);

module.exports = router;
