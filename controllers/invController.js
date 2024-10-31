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
    const invId = req.params.invId
    const vehicleData = await invModel.getVehicleById(invId)
    
    if (!vehicleData) {
      const err = new Error("Vehicle not found")
      err.status = 404
      return next(err)
    }

    let isFavorite = false
    if (res.locals.loggedin) {
      isFavorite = await invModel.checkIfFavorite(
        res.locals.accountData.account_id,
        invId
      )
    }

    const vehicleHtml = await utilities.buildVehicleHtml(vehicleData)

    res.render("./inventory/detail", {
      title: vehicleData.inv_make + " " + vehicleData.inv_model,
      nav: await utilities.getNav(),
      vehicleHtml: vehicleHtml,
      isFavorite: isFavorite,
      inv_id: vehicleData.inv_id
    })
  } catch (error) {
    next(error)
  }
}

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

  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect, //
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}





/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)

 
    if (!itemData) {
      const err = new Error("Vehicle not found")
      err.status = 404
      return next(err)
    }

    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    })
  }
}



/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)

    if (!itemData) {
      const err = new Error("Vehicle not found")
      err.status = 404
      return next(err)
    }

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price
    })
  } catch (error) {
    next(error)
  }
}



/* ***************************
 *  Process Delete Inventory
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
      req.flash("notice", "The vehicle was successfully deleted.")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.redirect("/inv/delete/" + inv_id)
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build user's favorites view
 * ************************** */
invCont.buildFavoritesView = async function (req, res) {
  try {
    let nav = await utilities.getNav()
    
    // 
    if (!res.locals.loggedin) {
      req.flash("notice", "Please log in to view favorites")
      return res.redirect("/account/login")
    }

    const account_id = res.locals.accountData.account_id
    const favorites = await invModel.getFavorites(account_id)
    
    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites: favorites || [], // 
      errors: null
    })
  } catch (error) {
    console.error("Error in buildFavoritesView:", error)
    req.flash("notice", "An error occurred while loading favorites")
    res.redirect("/account/")
  }
}

/* ***************************
 *  Add to favorites
 * ************************** */
invCont.addToFavorites = async function (req, res) {
  const inv_id = parseInt(req.params.invId)
  const account_id = res.locals.accountData.account_id

  try {
    const isAlreadyFavorite = await invModel.checkIfFavorite(account_id, inv_id)
    
    if (isAlreadyFavorite) {
      req.flash("notice", "Vehicle is already in favorites")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    const result = await invModel.addFavorite(account_id, inv_id)
    
    if (result) {
      req.flash("notice", "Vehicle added to favorites")
    } else {
      req.flash("notice", "Failed to add to favorites")
    }
    
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("Error in addToFavorites:", error)
    req.flash("notice", "An error occurred while adding to favorites")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 *  Remove from favorites
 * ************************** */
invCont.removeFromFavorites = async function (req, res) {
  const inv_id = parseInt(req.params.invId)
  const account_id = res.locals.accountData.account_id

  try {
    const result = await invModel.removeFavorite(account_id, inv_id)
    
    if (result) {
      req.flash("notice", "Vehicle removed from favorites")
    } else {
      req.flash("notice", "Failed to remove from favorites")
    }
    
    //
    res.redirect('/account/favorites')
  } catch (error) {
    console.error("Error in removeFromFavorites:", error)
    req.flash("notice", "An error occurred while removing from favorites")
    res.redirect('/account/favorites')
  }
}

module.exports = invCont;
