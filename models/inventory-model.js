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

module.exports = {
    getInventoryById,
    getVehiclesByClassification
}