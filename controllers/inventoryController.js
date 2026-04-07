const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

// ==============================
// Vehicle DETAIL view
// ==============================
async function buildDetailView(req, res, next) {
    try {
        const inv_id = req.params.inv_id

        const data = await invModel.getInventoryById(inv_id)

        if (!data) {
            const err = new Error("Vehicle not found")
            err.status = 404
            return next(err)
        }

        const detailHTML = utilities.buildDetailView(data)

        res.render("inventory/detail", {
            title: `${data.inv_make} ${data.inv_model}`,
            nav: await utilities.getNav(),
            detailHTML
        })
    } catch (error) {
        next(error)
    }
}

// ==============================
// Classification view
// ==============================
async function buildClassificationView(req, res, next) {
    try {
        const classificationName = req.params.classificationName

        const data = await invModel.getVehiclesByClassification(classificationName)

        if (!data || data.length === 0) {
            const err = new Error("No vehicles found for this classification")
            err.status = 404
            return next(err)
        }

        const grid = utilities.buildClassificationGrid(data)

        res.render("inventory/classification", {
            title: `${classificationName} Vehicles`,
            nav: await utilities.getNav(),
            classificationName,
            grid
        })
    } catch (error) {
        next(error)
    }
}

// ==============================
// Intentional error
// ==============================
function triggerError(req, res, next) {
    throw new Error("Intentional Server Error")
}

module.exports = {
    buildDetailView,
    buildClassificationView,
    triggerError
}