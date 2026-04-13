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

// // Show form
// router.get("/add-classification", invController.buildAddClassification);

// // Process form
// router.post("/add-classification", invController.addClassification);

const { body, validationResult } = require("express-validator")

// Classification validation rules
const classificationValidation = [
    body("classification_name")
        .trim()
        .notEmpty().withMessage("Classification name is required.")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("No spaces or special characters allowed.")
]

// Show form
router.get("/add-classification", invController.buildAddClassification)

// Process form
router.post("/add-classification", classificationValidation, invController.addClassification)

// Management view
router.get("/", invController.buildManagementView)

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

router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory", inventoryValidation, invController.addInventory)

module.exports = router