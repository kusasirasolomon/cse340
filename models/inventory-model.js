const pool = require("../database")

// ==============================
// Get ONE vehicle by ID
// ==============================
async function getInventoryById(inv_id) {
    try {
        const sql = "SELECT * FROM inventory WHERE inv_id = $1"
        const result = await pool.query(sql, [inv_id])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

// ==============================
// Get vehicles by classification name
// ==============================
async function getVehiclesByClassification(classificationName) {
    try {
        const sql = `
            SELECT i.*, c.classification_name
            FROM inventory i
            JOIN classification c 
            ON i.classification_id = c.classification_id
            WHERE c.classification_name = $1
        `
        const result = await pool.query(sql, [classificationName])
        return result.rows
    } catch (error) {
        throw error
    }
}
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

async function getClassifications() {
    return await pool.query("SELECT * FROM classification ORDER BY classification_name")
}

async function addInventory({ inv_make, inv_model, inv_year, inv_price,
    inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id }) {
    try {
        const sql = `INSERT INTO inventory 
            (inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
        const result = await pool.query(sql, [
            inv_make, inv_model, inv_year, inv_price,
            inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id
        ])
        return result.rows[0]
    } catch (error) { throw error }
}

// Get single inventory item for editing
async function updateInventory({ inv_id, inv_make, inv_model, inv_year, inv_price,
    inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id }) {
    try {
        const sql = `UPDATE inventory SET
            inv_make = $1, inv_model = $2, inv_year = $3, inv_price = $4,
            inv_miles = $5, inv_color = $6, inv_description = $7,
            inv_image = $8, inv_thumbnail = $9, classification_id = $10
            WHERE inv_id = $11 RETURNING *`
        const result = await pool.query(sql, [
            inv_make, inv_model, inv_year, inv_price,
            inv_miles, inv_color, inv_description,
            inv_image, inv_thumbnail, classification_id, inv_id
        ])
        return result.rows[0]
    } catch (error) { throw error }
}

// Delete inventory item
async function deleteInventory(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1"
        const result = await pool.query(sql, [inv_id])
        return result.rowCount
    } catch (error) { throw error }
}

async function getAllInventory() {
    try {
        const sql = "SELECT * FROM inventory ORDER BY inv_make"
        const result = await pool.query(sql)
        return result.rows
    } catch (error) { throw error }
}

module.exports = {
    getInventoryById,
    getVehiclesByClassification,
    addClassification,
    getClassifications,
    addInventory,
    updateInventory,
    deleteInventory,
    getAllInventory
}