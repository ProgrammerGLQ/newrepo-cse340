// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const invController = require("../controllers/invController")

// Route for viewing favorites
router.get("/favorites", 
    utilities.checkLogin,
    utilities.handleErrors(invController.buildFavoritesView)
)

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to handle registration form submission
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Default route for account management 
router.get("/", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Route for logout
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

// Route to build the account update view
router.get("/update/:accountId", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdate)
)

// Route to handle account update
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

// Route to handle password change
router.post(
    "/update/password",
    utilities.checkLogin,
    regValidate.changePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router