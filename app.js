// // require('dotenv').config(); // Load DATABASE_URL
// // console.log("DATABASE_URL:", process.env.DATABASE_URL);


// // app.js
// require("dotenv").config(); // Load environment variables from .env
// const express = require("express");
// const path = require("path");
// const app = express();

// // Import inventory routes
// const inventoryRoute = require("./routes/inventoryRoute");

// // Set EJS as the view engine
// app.set("view engine", "ejs");

// // Set the views folder (optional if default "views")
// app.set("views", path.join(__dirname, "views"));

// // Serve static files from "public" folder
// app.use(express.static(path.join(__dirname, "public")));

// // Test database connection
// const pool = require("./database"); // Your database/index.js
// pool.connect((err, client, release) => {
//     if (err) {
//         console.error("❌ Database connection failed:", err.stack);
//     } else {
//         console.log("✅ Database connected successfully!");
//         client.release();
//     }
// });

// // Routes
// app.use("/inv", inventoryRoute); // Inventory routes
// app.get("/", (req, res) => {
//     res.render("index", { title: "Home", nav: "<a href='/inv'>Inventory</a>" });
// });

// // Error handling middleware
// app.use((req, res, next) => {
//     const err = new Error("Page not found");
//     err.status = 404;
//     next(err);
// });

// // app.use((err, req, res, next) => {
// //     res.status(err.status || 500);
// //     res.render("error", {
// //         title: "Error",
// //         message: err.message,
// //         error: err
// //     });
// // });

// app.use((err, req, res, next) => {
//     console.error("🔥 Error caught:", err.message); // ADD THIS

//     res.status(err.status || 500);
//     res.render("error", {
//         title: "Error",
//         message: err.message,
//         // error: err
//         error: process.env.NODE_ENV === "development" ? err : {}
//     });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

// ==============================
// Routes
// ==============================
const inventoryRoute = require("./routes/inventoryRoute");

// ==============================
// View Engine
// ==============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==============================
// Static Files
// ==============================
app.use(express.static(path.join(__dirname, "public")));

// ==============================
// Database Connection Test
// ==============================
const pool = require("./database");

pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ Database connection failed:", err.stack);
    } else {
        console.log("✅ Database connected successfully!");
        release();
    }
});

// ==============================
// Routes
// ==============================
app.use("/inv", inventoryRoute);

// app.get("/", async (req, res) => {
//     res.render("index", {
//         title: "Home",
//         nav: "<a href='/inv'>Inventory</a>"
//     });
// });

const utilities = require("./utilities")

app.get("/", async (req, res) => {
    try {
        const nav = await utilities.getNav()

        res.render("index", {
            title: "Home",
            nav
        })
    } catch (error) {
        res.status(500).render("error", {
            title: "Server Error",
            message: "Something went wrong",
            status: 500,
            error
        })
    }
})

// ==============================
// 404 Handler (Must come BEFORE error handler)
// ==============================
app.use((req, res, next) => {
    const err = new Error("Page not found");
    err.status = 404;
    next(err);
});

// ==============================
// Error Handler (Must be LAST)
// ==============================
app.use((err, req, res, next) => {
    console.error("🔥 Error caught:", err.message);

    const status = err.status || 500;

    res.status(status);

    res.render("error", {
        title: status === 404 ? "404 Not Found" : "Server Error",
        message: err.message,
        status,
        error: process.env.NODE_ENV === "development" ? err : {}
    });
});

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});