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
function buildDetailView(vehicle) {
    return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">

      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>

        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>

        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `
}

// If you have a nav builder (from previous assignments), keep it
async function getNav() {
    // Example: fetch navigation HTML dynamically or return static
    return `
    <nav class="main-nav">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inv/classification/Custom">Custom</a></li>
        <li><a href="/inv/classification/Sedan">Sedan</a></li>
        <li><a href="/inv/classification/SUV">SUV</a></li>
        <li><a href="/inv/classification/Truck">Truck</a></li>
      </ul>
    </nav>
  `
}

// =======================
// Export all utilities
// =======================
module.exports = {
    buildClassificationGrid,
    buildDetailView,
    getNav
}