const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name must not contain spaces or special characters."),
    ]
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the vehicle make."),
        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the vehicle model."),
        // Añadir más reglas según necesites
    ]
}

/* ******************************
 * Check data and return errors 
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .isInt()
            .withMessage("Please select a valid classification."),
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a make with at least 3 characters."),
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a model with at least 3 characters."),
        body("inv_year")
            .isLength({ min: 4, max: 4 })
            .isInt()
            .withMessage("Please provide a valid 4-digit year."),
            body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),
        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an image path."),
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path."),
        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),
        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Please provide valid mileage."),
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color.")
    ]
}

/* ******************************
 * Check inventory data and return errors 
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { 
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}



// ... (código anterior sin cambios)

/* ******************************
 * Check inventory data and return errors or proceed to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { 
        inv_id,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            classificationList,
            inv_id,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = validate