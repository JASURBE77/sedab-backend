const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/admin.controller");

router.post("/", ctrl.createAdmin);
router.post("/seed", ctrl.seedData);
router.get("/stats", ctrl.getStats);
router.get("/staff", ctrl.getStaff);

/* ---- CHEF ---- */
router.post("/chef", ctrl.createChef);
router.get("/chefs", ctrl.getChefs);
router.put("/chef/:id", ctrl.updateChef);
router.delete("/chef/:id", ctrl.deleteChef);

/* ---- CASHIER ---- */
router.post("/cashier", ctrl.createCashier);
router.get("/cashiers", ctrl.getCashiers);
router.put("/cashier/:id", ctrl.updateCashier);
router.delete("/cashier/:id", ctrl.deleteCashier);

module.exports = router;
