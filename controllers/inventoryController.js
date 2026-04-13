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


async function buildAddClassification(req, res, next) {
    try {
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav: await utilities.getNav(),
            errors: [],
            classification_name: ""
        });
    } catch (error) {
        next(error);
    }
}



// async function addClassification(req, res, next) {
//     try {
//         const { classification_name } = req.body;

//         // validation
//         if (!classification_name) {
//             return res.render("inventory/add-classification", {
//                 title: "Add Classification",
//                 nav: await utilities.getNav(),
//                 errors: "Classification name is required",
//                 classification_name: ""
//             });
//         }

//         // insert into DB
//         const result = await invModel.addClassification(classification_name);

//         if (result) {
//             res.redirect("/inv");
//         } else {
//             throw new Error("Failed to add classification");
//         }

//     } catch (error) {
//         next(error);
//     }
// }

const { validationResult } = require("express-validator")

async function addClassification(req, res, next) {
    try {
        const errors = validationResult(req)
        const { classification_name } = req.body

        if (!errors.isEmpty()) {
            return res.render("inventory/add-classification", {
                title: "Add Classification",
                nav: await utilities.getNav(),
                errors: errors.array(),
                classification_name
            })
        }

        const result = await invModel.addClassification(classification_name)

        if (result) {
            req.flash("success", `Classification "${classification_name}" added successfully!`)
            res.redirect("/inv/")
        } else {
            req.flash("error", "Failed to add classification.")
            res.redirect("/inv/add-classification")
        }
    } catch (error) {
        next(error)
    }
}

async function buildManagementView(req, res, next) {
    try {
        res.render("inventory/management", {
            title: "Inventory Management",
            nav: await utilities.getNav(),
            messages: req.flash()
        })
    } catch (error) {
        next(error)
    }
}

async function buildAddInventory(req, res, next) {
    try {
        res.render("inventory/add-inventory", {
            title: "Add Vehicle",
            nav: await utilities.getNav(),
            classificationList: await utilities.buildClassificationList(),
            errors: null,
            inv_make: "", inv_model: "", inv_year: "",
            inv_price: "", inv_miles: "", inv_color: "",
            inv_description: "", inv_image: "/images/vehicles/no-image.png",
            inv_thumbnail: "/images/vehicles/no-image-tn.png"
        })
    } catch (error) { next(error) }
}

async function addInventory(req, res, next) {
    try {
        const errors = validationResult(req)
        const { inv_make, inv_model, inv_year, inv_price, inv_miles,
            inv_color, inv_description, inv_image, inv_thumbnail, classification_id } = req.body

        if (!errors.isEmpty()) {
            return res.render("inventory/add-inventory", {
                title: "Add Vehicle",
                nav: await utilities.getNav(),
                classificationList: await utilities.buildClassificationList(classification_id),
                errors: errors.array(),
                inv_make, inv_model, inv_year, inv_price,
                inv_miles, inv_color, inv_description, inv_image, inv_thumbnail
            })
        }

        const result = await invModel.addInventory({
            inv_make, inv_model, inv_year, inv_price,
            inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id
        })

        if (result) {
            req.flash("success", `${inv_make} ${inv_model} added successfully!`)
            res.redirect("/inv/")
        } else {
            req.flash("error", "Failed to add vehicle.")
            res.redirect("/inv/add-inventory")
        }
    } catch (error) { next(error) }
}

// module.exports = {
//     buildDetailView,
//     buildClassificationView,
//     triggerError,
//     buildAddClassification,
//     addClassification
// }
module.exports = {
    buildDetailView,
    buildClassificationView,
    triggerError,
    buildAddClassification,
    addClassification,
    buildManagementView,
    buildAddInventory,
    addInventory
}