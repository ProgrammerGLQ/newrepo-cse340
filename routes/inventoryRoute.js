// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to get the detail of a specific vehicle by its ID
router.get("/detail/:invId", utilities.handleErrors(invController.getVehicleById));

// Route to intentionally trigger a 500 error
router.get("/cause-error", utilities.handleErrors(invController.triggerError));

module.exports = router;
