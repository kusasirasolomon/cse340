// function buildDetailView(vehicle) {
//     return `
//     <div class="vehicle-detail">
//       <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">

//       <div class="vehicle-info">
//         <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

//         <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>

//         <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>

//         <p><strong>Description:</strong> ${vehicle.inv_description}</p>
//         <p><strong>Color:</strong> ${vehicle.inv_color}</p>
//       </div>
//     </div>
//   `
// }

// module.exports = {
//     buildDetailView
// }

// =======================
// Utilities Functions
// =======================

// Build the HTML for a classification page (vehicle list)
function buildClassificationGrid(data) {
    let grid = '<ul class="vehicle-grid">'

    data.forEach(vehicle => {
        grid += `
      <li class="vehicle-item">
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        </a>
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
      </li>
    `
    })

    grid += '</ul>'
    return grid
}

// Build the HTML for a single vehicle detail page
// function buildDetailView(vehicle) {
//     return `
//     <div class="vehicle-detail">
//       <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">

//       <div class="vehicle-info">
//         <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

//         <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>

//         <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>

//         <p><strong>Description:</strong> ${vehicle.inv_description}</p>
//         <p><strong>Color:</strong> ${vehicle.inv_color}</p>
//       </div>
//     </div>
//   `
// }
function buildDetailView(vehicle) {
  return `
    <div class="vehicle-detail">

      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      </div>

      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <p class="price">💰 Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>

        <p class="mileage">📍 Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>

        <p><strong>Color:</strong> ${vehicle.inv_color}</p>

        <p class="description">${vehicle.inv_description}</p>
      </div>

    </div>
  `
}


//     
//     return `
//     <nav class="main-nav">
//       <ul>
//         <li><a href="/">Home</a></li>
//         <li><a href="/inv/classification/Custom">Custom</a></li>
//         <li><a href="/inv/classification/Sedan">Sedan</a></li>
//         <li><a href="/inv/classification/SUV">SUV</a></li>
//         <li><a href="/inv/classification/Truck">Truck</a></li>
//       </ul>
//     </nav>
//   `
// }

const pool = require("../database")

async function getNav() {
  const data = await pool.query(
    "SELECT * FROM classification ORDER BY classification_name"
  )

  let nav = '<nav class="main-nav"><ul>'
  nav += '<li><a href="/">Home</a></li>'

  data.rows.forEach(row => {
    nav += `
            <li>
                <a href="/inv/classification/${row.classification_name}">
                    ${row.classification_name}
                </a>
            </li>
        `
  })

  nav += '</ul></nav>'

  return nav
}

// =======================
// Export all utilities
// =======================
module.exports = {
    buildClassificationGrid,
    buildDetailView,
    getNav
}