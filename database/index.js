// const { Pool } = require("pg")

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// })

// module.exports = pool

//second attempt


// const { Pool } = require("pg")

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })

// module.exports = pool


//third attempt
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 🔹 Test the database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ Database connection failed:", err.stack);
    } else {
        console.log("✅ Database connected successfully!");
        client.release(); // release the client back to the pool
    }
});

module.exports = pool;