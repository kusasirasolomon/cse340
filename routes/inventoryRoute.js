const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const { body } = require("express-validator")

// Classification validation rules
const classificationValidation = [
    body("classification_name")
        .trim()
        .notEmpty().withMessage("Classification name is required.")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("No spaces or special characters allowed.")
]

// Inventory validation rules
const inventoryValidation = [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").trim().isLength({ min: 4, max: 4 }).isNumeric().withMessage("Valid 4-digit year required."),
    body("inv_price").trim().isFloat({ min: 0 }).withMessage("Valid price required."),
    body("inv_miles").trim().isInt({ min: 0 }).withMessage("Valid mileage required."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("classification_id").notEmpty().withMessage("Classification is required.")
]

// Public routes (no login required)
router.get("/classification/:classificationName", invController.buildClassificationView)
router.get("/detail/:inv_id", invController.buildDetailView)
router.get("/trigger-error", invController.triggerError)

// Protected routes (Employee or Admin only)
router.get("/", utilities.checkEmployeeOrAdmin, invController.buildManagementView)
router.get("/add-classification", utilities.checkEmployeeOrAdmin, invController.buildAddClassification)
router.post("/add-classification", utilities.checkEmployeeOrAdmin, classificationValidation, invController.addClassification)
router.get("/add-inventory", utilities.checkEmployeeOrAdmin, invController.buildAddInventory)
router.post("/add-inventory", utilities.checkEmployeeOrAdmin, inventoryValidation, invController.addInventory)

module.exports = router