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
//mission overview
app.get("/", async (req, res) => {
    const result = await client.query("SELECT * FROM aircraft");

    res.json(result.rows);
});
//performance
app.get("/performance", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM performance");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});

//objective
app.get("/objectives", async (req, res) => {
    try {
        const result = await client.query(
            "SELECT * FROM objective_assessment"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});
//instructor summary
app.get('/api/instructor-summary', async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM instructor_summary LIMIT 1'
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//communication review
app.get('/api/communication-log', async (req, res) => {
    try {

        const result = await client.query(
            'SELECT * FROM communication_log ORDER BY timestamp'
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});

//mission timeline
app.get('/api/mission-timeline', async (req, res) => {

    try {

        const result = await client.query(
            "SELECT * FROM mission_timeline ORDER BY event_time"
        );

        res.json(result.rows);

    }
    catch (err) {

        console.error(err);
        res.status(500).send("Database Error");

    }

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

