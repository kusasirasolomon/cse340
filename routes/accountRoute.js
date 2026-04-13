const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const { body } = require("express-validator")

// Registration validation
const registrationValidation = [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Valid email is required.")
        .normalizeEmail(),
    body("account_password")
        .trim()
        .notEmpty().withMessage("Password is required.")
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("Password must be at least 12 characters with uppercase, lowercase, number and special character.")
]

// Login validation
const loginValidation = [
    body("account_email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Valid email is required."),
    body("account_password")
        .trim()
        .notEmpty().withMessage("Password is required.")
]

// Account update validation
const updateValidation = [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
        .trim()
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Valid email is required.")
        .normalizeEmail()
]

// Password update validation
const passwordValidation = [
    body("account_password")
        .trim()
        .notEmpty().withMessage("Password is required.")
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("Password must be at least 12 characters with uppercase, lowercase, number and special character.")
]

// Routes
router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)
router.get("/", utilities.checkLogin, accountController.buildManagement)
router.get("/update/:account_id", utilities.checkLogin, accountController.buildUpdate)
router.get("/logout", accountController.logout)

router.post("/register", registrationValidation, accountController.registerAccount)
router.post("/login", loginValidation, accountController.loginAccount)
router.post("/update", updateValidation, accountController.updateAccount)
router.post("/update-password", passwordValidation, accountController.updatePassword)

module.exports = router