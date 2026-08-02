const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
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

//Decision table
app.get('/api/decision-points', async (req, res) => {

    try {

        const result = await client.query(

            "SELECT * FROM decision_points ORDER BY event_time"

        );

        res.json(result.rows);

    }

    catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

    }

});

//change value of mission overview
app.put("/updateMission", async (req, res) => {
    console.log("PUT request received");
    console.log(req.body);

    const {
        missionName,
        status,
        date,
        duration,
        aircraft
    } = req.body;

    try {

        await client.query(
            `UPDATE aircraft
             SET aircraft_name = $1,
                 flight_date = $2,
                 status = $3,
                 duration = $4,
                 aircraft_count = $5
             WHERE id = 1`,
            [
                missionName,
                date,
                status,
                duration,
                aircraft
            ]
        );

        res.send("Aircraft updated successfully");

    } catch (err) {

        console.error(err);
        res.status(500).send("Database update failed");

    }

});


//change value of instruction summary
app.put("/updateInstructionSummary", async (req, res) => {
    console.log("PUT request received");
    console.log(req.body);

    const {
        operationalAwareness,
        tacticalDecision,
        communication,
        roeCompliance,
        instructorComments,
        instructorName
    } = req.body;

    try {

        await client.query(
            `UPDATE instructor_summary
             SET operational_awareness = $1,
                 tactical_decision_making = $2,
                 communication = $3,
                 roe_compliance = $4,
                 instructor_comments = $5,
                 instructor_name = $6
             WHERE summary_id = 1`,
            [
                operationalAwareness,
                tacticalDecision,
                communication,
                roeCompliance,
                instructorComments,
                instructorName
            ]
        );

        res.send("Instruction summary updated successfully");

    } catch (err) {

        console.error(err);
        res.status(500).send("Database update failed");

    }
});