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

// Show form
router.get("/add-classification", invController.buildAddClassification);

// Process form
router.post("/add-classification", invController.addClassification);

// Management view
router.get("/", invController.buildManagementView)

module.exports = router