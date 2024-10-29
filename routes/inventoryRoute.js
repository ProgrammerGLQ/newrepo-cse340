// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')

// Process the add classification form
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Process the add inventory form
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to get the detail of a specific vehicle by its ID
router.get("/detail/:invId", utilities.handleErrors(invController.getVehicleById));

// Route to get inventory by classification id - New Route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to edit inventory item
router.get("/edit/:invId", utilities.handleErrors(invController.editInventoryView))

// Process the update inventory form
router.post(
    "/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to intentionally trigger a 500 error
router.get("/cause-error", utilities.handleErrors(invController.triggerError));

module.exports = router;