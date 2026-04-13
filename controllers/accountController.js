const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

// Build login view
async function buildLogin(req, res, next) {
    try {
        res.render("account/login", {
            title: "Login",
            nav: await utilities.getNav(),
            errors: [],
            account_email: "",
            messages: req.flash()
        })
    } catch (error) { next(error) }
}

// Build register view
async function buildRegister(req, res, next) {
    try {
        res.render("account/register", {
            title: "Register",
            nav: await utilities.getNav(),
            errors: [],
            account_firstname: "",
            account_lastname: "",
            account_email: "",
            messages: req.flash()
        })
    } catch (error) { next(error) }
}

// Build account management view
async function buildManagement(req, res, next) {
    try {
        const accountData = res.locals.accountData
        res.render("account/management", {
            title: "Account Management",
            nav: await utilities.getNav(),
            errors: [],
            accountData,
            messages: req.flash()
        })
    } catch (error) { next(error) }
}

// Build account update view
async function buildUpdate(req, res, next) {
    try {
        const account_id = req.params.account_id
        const accountData = await accountModel.getAccountById(account_id)
        res.render("account/update", {
            title: "Update Account",
            nav: await utilities.getNav(),
            errors: [],
            accountData,
            messages: req.flash()
        })
    } catch (error) { next(error) }
}

// Register account
async function registerAccount(req, res, next) {
    try {
        const errors = validationResult(req)
        const { account_firstname, account_lastname, account_email, account_password } = req.body

        if (!errors.isEmpty()) {
            return res.render("account/register", {
                title: "Register",
                nav: await utilities.getNav(),
                errors: errors.array(),
                account_firstname,
                account_lastname,
                account_email,
                messages: req.flash()
            })
        }

        // Check if email exists
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
            req.flash("error", "Email already exists. Please use a different email.")
            return res.render("account/register", {
                title: "Register",
                nav: await utilities.getNav(),
                errors: [],
                account_firstname,
                account_lastname,
                account_email,
                messages: req.flash()
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(account_password, 10)

        const result = await accountModel.registerAccount(
            account_firstname, account_lastname, account_email, hashedPassword
        )

        if (result) {
            req.flash("success", "Registration successful! Please log in.")
            res.redirect("/account/login")
        } else {
            req.flash("error", "Registration failed. Please try again.")
            res.redirect("/account/register")
        }
    } catch (error) { next(error) }
}

// Login account
async function loginAccount(req, res, next) {
    try {
        const errors = validationResult(req)
        const { account_email, account_password } = req.body

        if (!errors.isEmpty()) {
            return res.render("account/login", {
                title: "Login",
                nav: await utilities.getNav(),
                errors: errors.array(),
                account_email,
                messages: req.flash()
            })
        }

        const accountData = await accountModel.getAccountByEmail(account_email)

        if (!accountData) {
            req.flash("error", "Invalid email or password.")
            return res.render("account/login", {
                title: "Login",
                nav: await utilities.getNav(),
                errors: [],
                account_email,
                messages: req.flash()
            })
        }

        const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)

        if (!passwordMatch) {
            req.flash("error", "Invalid email or password.")
            return res.render("account/login", {
                title: "Login",
                nav: await utilities.getNav(),
                errors: [],
                account_email,
                messages: req.flash()
            })
        }

        // Create JWT
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

        res.cookie("jwt", accessToken, {
            httpOnly: true,
            maxAge: 3600 * 1000
        })

        res.redirect("/account/")

    } catch (error) { next(error) }
}

// Update account info
async function updateAccount(req, res, next) {
    try {
        const errors = validationResult(req)
        const { account_firstname, account_lastname, account_email, account_id } = req.body

        if (!errors.isEmpty()) {
            const accountData = await accountModel.getAccountById(account_id)
            return res.render("account/update", {
                title: "Update Account",
                nav: await utilities.getNav(),
                errors: errors.array(),
                accountData,
                messages: req.flash()
            })
        }

        const result = await accountModel.updateAccount(
            account_firstname, account_lastname, account_email, account_id
        )

        if (result.rowCount) {
            // Update JWT with new data
            const updatedAccount = await accountModel.getAccountById(account_id)
            delete updatedAccount.account_password
            const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

            req.flash("success", "Account updated successfully!")
            res.redirect("/account/")
        } else {
            req.flash("error", "Update failed. Please try again.")
            res.redirect(`/account/update/${account_id}`)
        }
    } catch (error) { next(error) }
}

// Update password
async function updatePassword(req, res, next) {
    try {
        const errors = validationResult(req)
        const { account_password, account_id } = req.body

        if (!errors.isEmpty()) {
            const accountData = await accountModel.getAccountById(account_id)
            return res.render("account/update", {
                title: "Update Account",
                nav: await utilities.getNav(),
                errors: errors.array(),
                accountData,
                messages: req.flash()
            })
        }

        const hashedPassword = await bcrypt.hash(account_password, 10)
        const result = await accountModel.updatePassword(hashedPassword, account_id)

        if (result.rowCount) {
            req.flash("success", "Password updated successfully!")
            res.redirect("/account/")
        } else {
            req.flash("error", "Password update failed. Please try again.")
            res.redirect(`/account/update/${account_id}`)
        }
    } catch (error) { next(error) }
}

// Logout
async function logout(req, res, next) {
    try {
        res.clearCookie("jwt")
        res.redirect("/")
    } catch (error) { next(error) }
}

module.exports = {
    buildLogin,
    buildRegister,
    buildManagement,
    buildUpdate,
    registerAccount,
    loginAccount,
    updateAccount,
    updatePassword,
    logout
}