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

module.exports = invCont;
