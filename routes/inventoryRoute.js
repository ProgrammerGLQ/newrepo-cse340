// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')

// Middleware to check if user is logged in and is an Employee or Admin
const checkAdminOrEmployee = utilities.checkAdminOrEmployee;

// Process the add classification form
router.post(
    "/add-classification",
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Process the add inventory form
router.post(
    "/add-inventory",
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to build inventory management view
router.get("/", 
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    utilities.handleErrors(invController.buildManagementView)
);

// Route to build add classification view
router.get("/add-classification", 
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    utilities.handleErrors(invController.buildAddClassification)
);

// Route to build add inventory view
router.get("/add-inventory", 
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    utilities.handleErrors(invController.buildAddInventory)
);

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to get the detail of a specific vehicle by its ID
router.get("/detail/:invId", utilities.handleErrors(invController.getVehicleById));

// Route to get inventory by classification id - New Route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to edit inventory item
router.get("/edit/:invId", 
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    utilities.handleErrors(invController.editInventoryView)
)

// Process the update inventory form
router.post(
    "/update/",
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to delete inventory item
router.get("/delete/:invId", 
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    utilities.handleErrors(invController.deleteView)
)

// Process the delete
router.post("/delete", 
    utilities.checkLogin, // Check if logged in
    checkAdminOrEmployee, // Check if the user is Employee or Admin
    utilities.handleErrors(invController.deleteItem)
)

// Route to intentionally trigger a 500 error
router.get("/cause-error", utilities.handleErrors(invController.triggerError));

// Favorites
router.post("/favorite/add/:invId", 
    utilities.checkLogin,
    utilities.handleErrors(invController.addToFavorites)
)

router.post("/favorite/remove/:invId", 
    utilities.checkLogin,
    utilities.handleErrors(invController.removeFromFavorites)
)



module.exports = router;