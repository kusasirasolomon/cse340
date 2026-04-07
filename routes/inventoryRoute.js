const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")

// ==============================
// Classification route
// ==============================
router.get("/classification/:classificationName", invController.buildClassificationView)

// ==============================
// Detail route
// ==============================
router.get("/detail/:inv_id", invController.buildDetailView)

// ==============================
// Error route
// ==============================
router.get("/trigger-error", invController.triggerError)

module.exports = router