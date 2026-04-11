const express = require("express")          // Import Express
const router = express.Router()             // Create a router
const invController = require("../controllers/inventoryController")


router.get("/detail/:inv_id", invController.buildDetailView)
router.get("/trigger-error", invController.triggerError)
router.get("/classification/:classificationName", invController.buildClassificationView)

module.exports = router