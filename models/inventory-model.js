const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get a specific vehicle by inventory ID
 * ************************** */
async function getVehicleById(invId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [invId]
    )
    return data.rows[0] // Return the first row, assuming there will only be one vehicle with that ID
  } catch (error) {
    console.error("getVehicleById error " + error)
    throw error
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error " + error)
    return error.message
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error " + error)
    return error.message
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("deleteInventoryItem error " + error)
    throw new Error("Delete Inventory Error")
  }
}

/* ***************************
 *  Check if vehicle is in favorites
 * ************************** */
async function checkIfFavorite(account_id, inv_id) {
  try {
    const sql = "SELECT * FROM favorite WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkIfFavorite error: " + error)
    return false
  }
}

/* ***************************
 *  Add to favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO favorite (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("addFavorite error: " + error)
    return false
  }
}

/* ***************************
 *  Remove from favorites
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = "DELETE FROM favorite WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("removeFavorite error: " + error)
    return false
  }
}

/* ***************************
 *  Get user's favorites
 * ************************** */
async function getFavorites(account_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM inventory i
      JOIN classification c ON i.classification_id = c.classification_id
      JOIN favorite f ON i.inv_id = f.inv_id
      WHERE f.account_id = $1`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getFavorites error: " + error)
    return []
  }
}


module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventoryItem,
  checkIfFavorite,
  addFavorite,
  removeFavorite,
  getFavorites
}