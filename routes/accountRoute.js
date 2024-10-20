// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Route to build login view
router.get("/", utilities.handleErrors(accountController.buildLogin))
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to handle registration form submission
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )


module.exports = router