// const express = require("express");
// const app = express();

// app.set("view engine", "ejs");

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//     res.render("index");
// });

// app.listen(3000, () => {
//     console.log("Server running");
// });


// second last attempt
// const express = require("express");
// const app = express();

// const inventoryRoute = require("./routes/inventoryRoute")

// app.set("view engine", "ejs");

// app.use(express.static("public"));

// app.use("/inv", inventoryRoute)

// app.get("/", (req, res) => {
//     res.render("index");
// });

// app.listen(3000, () => {
//     console.log("Server running");
// });


// last version 
require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();

// ==============================
// Routes
// ==============================
const inventoryRoute = require("./routes/inventoryRoute");

// ==============================
// Utilities
// ==============================
const utilities = require("./utilities");

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
// Body Parser (IMPORTANT for forms)
// ==============================
const session = require("express-session")
const flash = require("connect-flash")

app.use(session({
    secret: process.env.SESSION_SECRET || "superSecret",
    resave: false,
    saveUninitialized: true
}))
// app.use(flash())
app.use(flash())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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

// ==============================
// Home Route (FIXED NAV ISSUE)
// ==============================
app.get("/", async (req, res) => {
    let nav = "";

    try {
        nav = await utilities.getNav();
    } catch (error) {
        console.error("Nav error:", error);
        nav = "<nav><a href='/'>Home</a></nav>";
    }

    res.render("index", {
        title: "Home",
        nav
    });
});

// ==============================
// 404 Handler
// ==============================
app.use((req, res, next) => {
    const err = new Error("Page not found");
    err.status = 404;
    next(err);
});

// ==============================
// Error Handler
// ==============================
app.use((err, req, res, next) => {
    console.error("🔥 Error caught:", err.message);

    const status = err.status || 500;

    res.status(status).render("error", {
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