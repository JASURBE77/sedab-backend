const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/customer.controller");

router.get("/", ctrl.getCustomers);
router.get("/:id", ctrl.getCustomer);
router.post("/", ctrl.createCustomer);
router.put("/:id", ctrl.updateCustomer);
router.delete("/:id", ctrl.deleteCustomer);

module.exports = router;
