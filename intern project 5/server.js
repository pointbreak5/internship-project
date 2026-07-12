const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "dashboarddb",
    password: "1234",
    port: 5432,
});

client.connect()
    .then(() => {
        console.log("✅ Connected to PostgreSQL");
    })
    .catch(err => {
        console.error("Database Connection Error:", err);
    });

app.get("/", async (req, res) => {
    const result = await client.query("SELECT * FROM aircraft");

    res.json(result.rows);
});

app.get("/performance", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM performance");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});