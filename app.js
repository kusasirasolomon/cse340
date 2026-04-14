
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

app.use(express.urlencoded({ extended: true }));

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
        const nav = await utilities.getNav() || "";

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

// app.use(express.urlencoded({ extended: true }));

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});