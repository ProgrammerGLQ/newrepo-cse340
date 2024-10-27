const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Get Vehicle by ID for detail view
 * ************************** */
invCont.getVehicleById = async function (req, res, next) {
  try {
    // Get the vehicle ID from the URL parameters
    const invId = req.params.invId;

    // Call the model function to retrieve the vehicle's data
    const vehicleData = await invModel.getVehicleById(invId);
    
    // If no vehicle is found, return a 404 error
    if (!vehicleData) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    // Build the vehicle-specific HTML using the utilities function
    const vehicleHtml = await utilities.buildVehicleHtml(vehicleData);

    // Render the 'detail.ejs' view with the vehicle's data
    res.render("./inventory/detail", {
      title: vehicleData.inv_make + " " + vehicleData.inv_model,
      nav: await utilities.getNav(),
      vehicleHtml: vehicleHtml
    });
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

/* ***************************
 *  Intentionally Trigger a 500 Error
 * ************************** */
invCont.triggerError = (req, res, next) => {
// Create an intentional error
  const error = new Error("This is an intentional error of type 500");
  error.status = 500;
  next(error); // Pass the error to the error-handling middleware
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  
  const classResult = await invModel.addClassification(classification_name)
  
  if (classResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
      errors: null,
    })
  }
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  const { 
    inv_make, 
    inv_model, 
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id 
  } = req.body

  const invResult = await invModel.addInventory(
    inv_make, 
    inv_model, 
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (invResult) {
    req.flash (
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the inventory item failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      errors: null,
    })
  }
}
module.exports = invCont;
