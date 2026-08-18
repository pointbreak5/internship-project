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

//Secondary Tactical Decisions table
app.get('/api/secondary-decisions', async (req, res) => {
    try {
        const result = await client.query(
            "SELECT * FROM secondary_decisions ORDER BY event_time"
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

//change value of objectives
app.put("/updateObjectives", async (req, res) => {
    console.log("PUT updateObjectives received");
    console.log(req.body);

    const objectives = req.body;

    try {
        for (const obj of objectives) {
            await client.query(
                `UPDATE objective_assessment
                 SET objective = $1,
                     weight = $2,
                     status = $3,
                     score = $4
                 WHERE id = $5`,
                [obj.objective, obj.weight, obj.status, obj.score, obj.id]
            );
        }
        res.send("Objectives updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database update failed");
    }
});

//change value of communication log
app.put("/api/updateCommunicationLog", async (req, res) => {
    console.log("PUT updateCommunicationLog received");
    console.log(req.body);

    const logEntries = req.body;

    try {
        for (const entry of logEntries) {
            await client.query(
                `UPDATE communication_log
                 SET timestamp = $1,
                     sender = $2,
                     receiver = $3,
                     message = $4,
                     status = $5
                 WHERE log_id = $6`,
                [entry.timestamp, entry.sender, entry.receiver, entry.message, entry.status, entry.log_id]
            );
        }
        res.send("Communication log updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database update failed");
    }
});

//change value of performance
app.put("/api/updatePerformance", async (req, res) => {
    console.log("PUT updatePerformance received");
    console.log(req.body);

    const { accuracy, efficiency, survivability } = req.body;

    try {
        await client.query(
            `UPDATE performance
             SET accuracy = $1,
                 efficiency = $2,
                 survivability = $3
             WHERE id = 1`,
            [accuracy, efficiency, survivability]
        );
        res.send("Performance updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database update failed");
    }
});