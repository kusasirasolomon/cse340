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

const express = require("express");
const app = express();

const inventoryRoute = require("./routes/inventoryRoute") 

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/inv", inventoryRoute) 

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log("Server running");
});