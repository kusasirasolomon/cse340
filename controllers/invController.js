const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

// DETAIL VIEW
async function buildDetailView(req, res, next) {
    try {
        const inv_id = req.params.inv_id

        const data = await invModel.getInventoryById(inv_id)

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

// INTENTIONAL ERROR
function triggerError(req, res, next) {
    try {
        throw new Error("Intentional Server Error")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    buildDetailView,
    triggerError
}