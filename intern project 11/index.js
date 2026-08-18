
function safeOnClick(id, callback) {
    const el = document.getElementById(id);
    if (el) el.onclick = callback;
}

document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav');

    navItems.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove the active ID from all navigation elements
            navItems.forEach(t => t.removeAttribute('id'));

            // Set the active ID on the clicked element
            tab.id = 'nav-over';
        });
    });
});

//connecting backend with db and retrive the data
fetch("http://localhost:3000")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (!data || data.length === 0) return;

        const missionNameEl = document.getElementById("mission-name");
        if (missionNameEl) missionNameEl.textContent = data[0].aircraft_name;

        const statusEl = document.getElementById("status");
        if (statusEl) {
            const statusText = data[0].status;
            if (statusText === "Completed") {
                statusEl.innerHTML = '<span class="status-completed">Completed</span>';
            } else if (statusText === "In Progress") {
                statusEl.innerHTML = '<span class="status-in-progress">In Progress</span>';
            } else if (statusText === "Failed") {
                statusEl.innerHTML = '<span class="status-failed">Failed</span>';
            } else if (statusText === "Aborted") {
                statusEl.innerHTML = '<span class="status-aborted">Aborted</span>';
            } else {
                statusEl.textContent = statusText;
            }
        }

        const dateEl = document.getElementById("date");
        if (dateEl && data[0].flight_date) dateEl.textContent = data[0].flight_date.substring(0, 10);

        const durationEl = document.getElementById("duration");
        if (durationEl) durationEl.textContent = data[0].duration;

        const aircraftCountEl = document.getElementById("aircraft-count");
        if (aircraftCountEl) aircraftCountEl.textContent = data[0].aircraft_count;
    })
    .catch(error => {
        console.error(error);
    });



//connecting performance metric data
let performanceEditMode = false;

function loadPerformance() {
    fetch("http://localhost:3000/performance")
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) return;
            const performance = data[0];

            const accuracyValEl = document.getElementById("accuracy-value");

            if (accuracyValEl) {
                if (performanceEditMode) {
                    accuracyValEl.innerHTML =
                        `<input type="number"
                    min="0"
                    max="100"
                    value="${performance.accuracy}"
                    class="performance-input">`;
                } else {
                    accuracyValEl.textContent =
                        performance.accuracy + "%";
                }
            }

            const efficiencyValEl = document.getElementById("efficiency-value");

            if (efficiencyValEl) {
                if (performanceEditMode) {
                    efficiencyValEl.innerHTML =
                        `<input type="number"
                    min="0"
                    max="100"
                    value="${performance.efficiency}"
                    class="performance-input">`;
                } else {
                    efficiencyValEl.textContent =
                        performance.efficiency + "%";
                }
            }

            const survivabilityValEl = document.getElementById("survivability-value");

            if (survivabilityValEl) {
                if (performanceEditMode) {
                    survivabilityValEl.innerHTML =
                        `<input type="number"
                    min="0"
                    max="100"
                    value="${performance.survivability}"
                    class="performance-input">`;
                } else {
                    survivabilityValEl.textContent =
                        performance.survivability + "%";
                }
            }

            safeOnClick("performance-edit-btn", function () {
                performanceEditMode = true;
                document.getElementById("performance-save-btn").style.display = "inline-block";
                document.getElementById("performance-cancel-btn").style.display = "inline-block";
                document.getElementById("performance-edit-btn").style.display = "none";
                loadPerformance();
            });

            //to make the circle dynamic
            const accuracyCircleEl = document.getElementById("accuracy-circle");
            if (accuracyCircleEl) accuracyCircleEl.style.setProperty("--progress", performance.accuracy + "%");

            const efficiencyCircleEl = document.getElementById("efficiency-circle");
            if (efficiencyCircleEl) efficiencyCircleEl.style.setProperty("--progress", performance.efficiency + "%");

            const survivabilityCircleEl = document.getElementById("survivability-circle");
            if (survivabilityCircleEl) survivabilityCircleEl.style.setProperty("--progress", performance.survivability + "%");
        })
        .catch(error => {
            console.error(error);
        });

    safeOnClick("performance-cancel-btn", function () {
        performanceEditMode = false;
        document.getElementById("performance-save-btn").style.display = "none";
        document.getElementById("performance-cancel-btn").style.display = "none";
        document.getElementById("performance-edit-btn").style.display = "inline-block";
        loadPerformance();
    });

    safeOnClick("performance-save-btn", function () {
        const accuracy = document.querySelector("#accuracy-value .performance-input").value;
        const efficiency = document.querySelector("#efficiency-value .performance-input").value;
        const survivability = document.querySelector("#survivability-value .performance-input").value;

        const performanceData = {
            accuracy: parseInt(accuracy),
            efficiency: parseInt(efficiency),
            survivability: parseInt(survivability)
        };

        // Send data to backend
        fetch("http://localhost:3000/api/updatePerformance", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(performanceData)
        })
        .then(response => response.text())
        .then(msg => {
            console.log(msg);
            performanceEditMode = false;
            document.getElementById("performance-save-btn").style.display = "none";
            document.getElementById("performance-cancel-btn").style.display = "none";
            document.getElementById("performance-edit-btn").style.display = "inline-block";
            loadPerformance();
        })
        .catch(error => {
            console.error("Error updating performance:", error);
        });
    });
}

loadPerformance();



//fetching objective assessment
let objectiveEditMode = false;

function loadObjectives() {

    fetch("http://localhost:3000/objectives")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("objective-body");
            if (!tableBody) return;
            tableBody.innerHTML = "";

            data.forEach(item => {
                let statusClass = "";

                if (item.status === "COMPLETED") {
                    statusClass = "status-completed";
                } else if (item.status === "PARTIAL") {
                    statusClass = "status-partial";
                } else {
                    statusClass = "status-pending";
                }

                const row = document.createElement("tr");
                row.dataset.id = item.id;

                row.innerHTML = `
                <td>${objectiveEditMode ? `<input type="text" value="${item.objective}" class="objective-input">` : item.objective}</td>
                <td>${objectiveEditMode ? `<input type="number" min="0" max="100" value="${parseInt(item.weight)}" class="weight-input">` : item.weight}</td>
                <td>
                    ${objectiveEditMode
                        ? `
                    <select class="status-select">

                        <option value="COMPLETED"
                        ${item.status === "COMPLETED" ? "selected" : ""}>
                            COMPLETED
                        </option>

                        <option value="PARTIAL"
                        ${item.status === "PARTIAL" ? "selected" : ""}>
                            PARTIAL
                        </option>

                        <option value="PENDING"
                        ${item.status === "PENDING" ? "selected" : ""}>
                            PENDING
                        </option>

                    </select>
                        `
                        :
                        `<span class="${statusClass}">${item.status}</span>`
                    }
                </td>
                <td>${objectiveEditMode ? `<input type="text" value="${item.score}" class="score-input">` : item.score}</td>
                 `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error(error);
        });
}
safeOnClick("objective-edit-btn", function () {

    objectiveEditMode = true;
    document.getElementById("objective-save-btn").style.display = "inline-block";
    document.getElementById("objective-cancel-btn").style.display = "inline-block";
    document.getElementById("objective-edit-btn").style.display = "none";

    loadObjectives();
    //cancel button
    document.getElementById("objective-cancel-btn").onclick = function () {

        objectiveEditMode = false;

        document.getElementById("objective-save-btn").style.display = "none";
        document.getElementById("objective-cancel-btn").style.display = "none";
        document.getElementById("objective-edit-btn").style.display = "inline-block";
        loadObjectives();

    };

    // Save button
    document.getElementById("objective-save-btn").onclick = function () {

        const rows = document.querySelectorAll("#objective-body tr");

        const objectives = [];

        rows.forEach(row => {

            const objective = row.querySelector(".objective-input").value;
            const weight = row.querySelector(".weight-input").value;
            const status = row.querySelector(".status-select").value;
            const score = row.querySelector(".score-input").value;

            objectives.push({
                id: row.dataset.id,
                objective: objective,
                weight: weight + "%",
                status: status,
                score: score
            });

        });

        console.log(objectives);


        // Send data to backend
        fetch("http://localhost:3000/updateObjectives", {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(objectives)
        })

            .then(response => response.text())

            .then(msg => {

                console.log(msg);

                // Return to normal view
                objectiveEditMode = false;

                document.getElementById("objective-save-btn").style.display = "none";
                document.getElementById("objective-cancel-btn").style.display = "none";
                document.getElementById("objective-edit-btn").style.display = "inline-block";

                loadObjectives();

            });

    };
});

// to get values for instructor summary
async function loadInstructorSummary() {
    try {
        const response = await fetch("http://localhost:3000/api/instructor-summary");
        const data = await response.json();
        if (!data) return;

        const opAwarenessEl = document.getElementById("operational-awareness");
        if (opAwarenessEl) opAwarenessEl.textContent = data.operational_awareness + " / 5";

        const tacDecisionEl = document.getElementById("tactical-decision");
        if (tacDecisionEl) tacDecisionEl.textContent = data.tactical_decision_making + " / 5";

        const commsEl = document.getElementById("communication");
        if (commsEl) commsEl.textContent = data.communication + " / 5";

        const roeEl = document.getElementById("roe-compliance");
        if (roeEl) roeEl.textContent = data.roe_compliance + " / 5";

        const commentsEl = document.getElementById("instructor-comments");
        if (commentsEl) commentsEl.textContent = data.instructor_comments;

        const nameEl = document.getElementById("instructor-name");
        if (nameEl) nameEl.textContent = data.instructor_name;

        // Calculate Overall Rating
        const overall =
            (
                data.operational_awareness +
                data.tactical_decision_making +
                data.communication +
                data.roe_compliance
            ) / 4;

        const overallEl = document.getElementById("overall-rating");
        if (overallEl) overallEl.textContent = overall.toFixed(1) + " / 5";

        const roundedRating = Math.round(overall);

        let stars = "";

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars += "★";
            } else {
                stars += "☆";
            }
        }

        const starsEl = document.getElementById("stars");
        if (starsEl) starsEl.textContent = stars;

    } catch (error) {
        console.error("Error loading instructor summary:", error);
    }
}

loadInstructorSummary();

let communicationEditMode = false;

//coomunication
async function loadCommunicationLog() {
    try {
        const response = await fetch("http://localhost:3000/api/communication-log");
        const data = await response.json();
        const tbody = document.getElementById("communication-body");
        if (!tbody) return;
        tbody.innerHTML = "";

        data.forEach(log => {
            const row = document.createElement("tr");
            row.dataset.id = log.log_id;
            row.innerHTML = `
                    <td>${communicationEditMode ? `<input type="text" value="${log.timestamp}" class="comm-timestamp-input">` : log.timestamp}</td>
                    <td>${communicationEditMode ? `<input type="text" value="${log.sender}" class="comm-sender-input">` : log.sender}</td>
                    <td>${communicationEditMode ? `<input type="text" value="${log.receiver}" class="comm-receiver-input">` : log.receiver}</td>
                    <td>${communicationEditMode ? `<input type="text" value="${log.message}" class="comm-message-input">` : log.message}</td>
                    <td>${communicationEditMode ? `<input type="text" value="${log.status}" class="comm-status-input">` : log.status}</td>
                `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

loadCommunicationLog();

safeOnClick("communication-edit-btn", function () {
    communicationEditMode = true;
    document.getElementById("communication-save-btn").style.display = "inline-block";
    document.getElementById("communication-cancel-btn").style.display = "inline-block";
    document.getElementById("communication-edit-btn").style.display = "none";

    loadCommunicationLog();

    //cancel button
    document.getElementById("communication-cancel-btn").onclick = function () {
        communicationEditMode = false;
        document.getElementById("communication-save-btn").style.display = "none";
        document.getElementById("communication-cancel-btn").style.display = "none";
        document.getElementById("communication-edit-btn").style.display = "inline-block";
        loadCommunicationLog();
    };

    // Save button
    document.getElementById("communication-save-btn").onclick = function () {
        const rows = document.querySelectorAll("#communication-body tr");
        const logEntries = [];
        rows.forEach(row => {
            const timestamp = row.querySelector(".comm-timestamp-input").value;
            const sender = row.querySelector(".comm-sender-input").value;
            const receiver = row.querySelector(".comm-receiver-input").value;
            const message = row.querySelector(".comm-message-input").value;
            const status = row.querySelector(".comm-status-input").value;
            logEntries.push({
                log_id: row.dataset.id,
                timestamp: timestamp,
                sender: sender,
                receiver: receiver,
                message: message,
                status: status
            });
        });

        // Send data to backend
        fetch("http://localhost:3000/api/updateCommunicationLog", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logEntries)
        })
            .then(response => response.text())
            .then(msg => {
                console.log(msg);
                communicationEditMode = false;
                document.getElementById("communication-save-btn").style.display = "none";
                document.getElementById("communication-cancel-btn").style.display = "none";
                document.getElementById("communication-edit-btn").style.display = "inline-block";
                loadCommunicationLog();
            });
    };
});

//mission timeline
async function loadMissionTimeline() {
    try {
        const response = await fetch("http://localhost:3000/api/mission-timeline");
        const data = await response.json();
        const container = document.getElementById("timeline-container");
        if (!container) return;
        container.innerHTML = "";

        data.forEach(event => {
            container.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-time">
                    ${event.event_time}
                </div>
                <div class="timeline-dot ${event.status}"></div>
                <div class="timeline-content">
                    <div class="timeline-title">
                        ${event.event_name}
                    </div>
                    <div class="timeline-description">
                        ${event.description}
                    </div>
                </div>
            </div>
            `;
        });
    }
    catch (error) {
        console.error(error);
    }
}

loadMissionTimeline();

//decision table
async function loadDecisionPoints() {

    try {

        const response = await fetch("http://localhost:3000/api/decision-points");

        const data = await response.json();

        const tbody = document.getElementById("decision-body");

        if (tbody) {
            tbody.innerHTML = "";

            data.forEach(item => {

                tbody.innerHTML += `

                <tr>

                    <td>${item.event_time}</td>
                    <td>${item.decision_event}</td>
                    <td>${item.action_taken}</td>
                    <td>${item.roe_outcome}</td>
                    <td>${item.audit_status}</td>
                    <td>${item.threat_level}</td>
                    <td>${item.decision_by}</td>
                    <td>${item.response_time}</td>
                    <td>${item.remarks}</td>
                    <td>${item.mission_phase}</td>
                    <td>${item.average}</td>
                    <td>${item.overall}</td>
                    <td>${item.instructor}</td>
                    <td>${item.action}</td>
                    <td>${item.replay}</td>
                    <td>${item.more_feedback}</td>
                    <td>${item.selection}</td>


                </tr>

                `;

            });
        }

    }

    catch (err) {

        console.log(err);

    }

}

loadDecisionPoints();

//secondary tactical decisions table
async function loadSecondaryDecisions() {
    try {
        const response = await fetch("http://localhost:3000/api/secondary-decisions");
        const data = await response.json();
        const tbody = document.getElementById("secondary-body");
        if (tbody) {
            tbody.innerHTML = "";
            data.forEach(item => {
                let statusStyle = "";
                if (item.tactic_status === "SUCCESS") {
                    statusStyle = 'style="color: #00FF88;"';
                } else if (item.tactic_status === "FAILED") {
                    statusStyle = 'style="color: #FF4444;"';
                } else if (item.tactic_status === "PARTIAL") {
                    statusStyle = 'style="color: #FFCC00;"';
                }
                tbody.innerHTML += `
                <tr style="border-bottom: 1px solid #384456;">
                    <td style="padding: 10px 5px;">${item.event_time}</td>
                    <td>${item.tactic_name}</td>
                    <td>${item.target_engagement}</td>
                    <td>${item.altitude_ft}</td>
                    <td>${item.speed_mach}</td>
                    <td>${item.g_force}</td>
                    <td><span ${statusStyle}>${item.tactic_status}</span></td>
                    <td>${item.remarks}</td>
                </tr>
                `;
            });
        }
    }
    catch (err) {
        console.error(err);
    }
}

loadSecondaryDecisions();
loadObjectives();

const overviewContainer = document.getElementById("map");

if (overviewContainer) {

    const map = L.map(overviewContainer).setView([22, 79], 9);

    fetch("custom.geo.json")
        .then(r => r.json())
        .then(data => {

            const customLayer = L.geoJSON(data, {
                style: {
                    color: "#00ffcc",
                    weight: 2,
                    fillColor: "#0d3b66",
                    fillOpacity: 0.25
                }
            }).addTo(map);

            map.fitBounds(customLayer.getBounds());

        });

}


const replayContainer = document.getElementById("map1");

if (replayContainer) {

    const replayMap = L.map(replayContainer).setView([22.5, 79], 5);

    fetch("india-osm.geojson")
        .then(r => r.json())
        .then(data => {

            const indiaLayer = L.geoJSON(data, {
                style: {
                    color: "#00ffcc",
                    weight: 2,
                    fillColor: "#0d3b66",
                    fillOpacity: 0.25
                }
            }).addTo(replayMap);

            replayMap.fitBounds(indiaLayer.getBounds());

        });

}

//Edit-mission-overview
safeOnClick("edit-btn", function () {

    document.getElementById("editModal").style.display = "flex";

    document.getElementById("edit-name").value =
        document.getElementById("mission-name").textContent;

    document.getElementById("edit-status").value =
        document.getElementById("status").textContent;

    document.getElementById("edit-date").value =
        document.getElementById("date").textContent;

    document.getElementById("edit-duration").value =
        document.getElementById("duration").textContent;

    document.getElementById("edit-aircraft").value =
        document.getElementById("aircraft-count").textContent;
});

//cancel
safeOnClick("cancelBtn", function () {
    document.getElementById("editModal").style.display = "none";
});

//save
safeOnClick("saveBtn", function () {
    document.getElementById("editModal").style.display = "none";

    document.getElementById("mission-name").textContent =
        document.getElementById("edit-name").value;

    const status = document.getElementById("edit-status").value;

    let statusClass = "";

    if (status === "Completed") {
        statusClass = "status-completed";
    }
    else if (status === "In Progress") {
        statusClass = "status-in-progress";
    }
    else if (status === "Failed") {
        statusClass = "status-failed";
    }
    else if (status === "Aborted") {
        statusClass = "status-aborted";
    }

    document.getElementById("status").innerHTML =
        `<span class="${statusClass}">${status}</span>`;

    document.getElementById("date").textContent =
        document.getElementById("edit-date").value;

    document.getElementById("duration").textContent =
        document.getElementById("edit-duration").value;

    document.getElementById("aircraft-count").textContent =
        document.getElementById("edit-aircraft").value;


    //change in POSTGRESQL
    fetch("http://localhost:3000/updateMission", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            missionName: document.getElementById("edit-name").value,
            status: document.getElementById("edit-status").value,
            date: document.getElementById("edit-date").value,
            duration: document.getElementById("edit-duration").value,
            aircraft: document.getElementById("edit-aircraft").value
        })
    })
        .then(response => response.text())
        .then(msg => {
            console.log(msg);
        });
});

//Edit Instruction Summary
safeOnClick("summary-edit-btn", function () {
    document.getElementById("summary-modal").style.display = "flex";

    document.getElementById("edit-ow").value =
        parseInt(document.getElementById("operational-awareness").textContent);

    document.getElementById("edit-tdm").value =
        parseInt(document.getElementById("tactical-decision").textContent);

    document.getElementById("edit-comm").value =
        parseInt(document.getElementById("communication").textContent);

    document.getElementById("edit-roe").value =
        parseInt(document.getElementById("roe-compliance").textContent);

    document.getElementById("edit-instructor-comments").value =
        document.getElementById("instructor-comments").textContent;

    document.getElementById("edit-instructor-name").value =
        document.getElementById("instructor-name").textContent;
});
//cancel
safeOnClick("cancelBtn2", function () {
    document.getElementById("summary-modal").style.display = "none";
});

//save
safeOnClick("saveBtn2", function () {
    document.getElementById("summary-modal").style.display = "none";

    document.getElementById("operational-awareness").textContent = document.getElementById("edit-ow").value + " / 5";
    document.getElementById("tactical-decision").textContent = document.getElementById("edit-tdm").value + " / 5";
    document.getElementById("communication").textContent = document.getElementById("edit-comm").value + " / 5";
    document.getElementById("roe-compliance").textContent = document.getElementById("edit-roe").value + " / 5";
    document.getElementById("instructor-comments").textContent = document.getElementById("edit-instructor-comments").value;
    document.getElementById("instructor-name").textContent = document.getElementById("edit-instructor-name").value;


    //send to database
    fetch("http://localhost:3000/updateInstructionSummary", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            operationalAwareness: document.getElementById("edit-ow").value,
            tacticalDecision: document.getElementById("edit-tdm").value,
            communication: document.getElementById("edit-comm").value,
            roeCompliance: document.getElementById("edit-roe").value,
            instructorComments: document.getElementById("edit-instructor-comments").value,
            instructorName: document.getElementById("edit-instructor-name").value
        })
    })
        .then(response => response.text())
        .then(msg => {
            console.log(msg);
        });


});

// Time and Date Clock in Header
function startHeaderClock() {
    function updateClock() {
        const timeEl = document.getElementById("clock-time");
        const dateEl = document.getElementById("clock-date");
        if (!timeEl || !dateEl) return;

        const now = new Date();

        // Format time: HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}:${seconds}`;

        // Format date: DD MMM YYYY (e.g. 18 AUG 2026)
        const days = String(now.getDate()).padStart(2, '0');
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        dateEl.textContent = `${days} ${month} ${year}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

document.addEventListener("DOMContentLoaded", startHeaderClock);
startHeaderClock();

// CSV Export Logic
async function exportMissionDataToCSV() {
    try {
        // Fetch data from database APIs
        const overviewRes = await fetch("http://localhost:3000");
        const overviewData = await overviewRes.json();
        
        const objectivesRes = await fetch("http://localhost:3000/objectives");
        const objectivesData = await objectivesRes.json();
        
        const instructorRes = await fetch("http://localhost:3000/api/instructor-summary");
        const instructorData = await instructorRes.json();
        
        // Build CSV Content
        let csvContent = "";
        
        // Helper to format values safely for CSV
        const csvValue = (val) => {
            if (val === null || val === undefined) return '""';
            const str = String(val).replace(/"/g, '""'); // Escape double quotes
            return `"${str}"`;
        };

        // 1. Mission Overview
        csvContent += "MISSION OVERVIEW\n";
        csvContent += "Parameter,Value\n";
        if (overviewData && overviewData.length > 0) {
            const m = overviewData[0];
            const dateStr = m.flight_date ? m.flight_date.substring(0, 10) : "";
            csvContent += `Name,${csvValue(m.aircraft_name)}\n`;
            csvContent += `Status,${csvValue(m.status)}\n`;
            csvContent += `Date,${csvValue(dateStr)}\n`;
            csvContent += `Duration,${csvValue(m.duration)}\n`;
            csvContent += `Aircraft Count,${csvValue(m.aircraft_count)}\n`;
        }
        csvContent += "\n";
        
        // 2. Objective Assessment
        csvContent += "OBJECTIVE ASSESSMENT\n";
        csvContent += "Objective,Weight,Status,Score\n";
        if (objectivesData && objectivesData.length > 0) {
            objectivesData.forEach(obj => {
                csvContent += `${csvValue(obj.objective)},${csvValue(obj.weight)},${csvValue(obj.status)},${csvValue(obj.score)}\n`;
            });
        }
        csvContent += "\n";
        
        // 3. Instructor Summary
        csvContent += "INSTRUCTOR SUMMARY\n";
        csvContent += "Parameter,Rating / Comment\n";
        if (instructorData) {
            csvContent += `Operational Awareness,${csvValue(instructorData.operational_awareness + " / 5")}\n`;
            csvContent += `Tactical Decision Making,${csvValue(instructorData.tactical_decision_making + " / 5")}\n`;
            csvContent += `Communication,${csvValue(instructorData.communication + " / 5")}\n`;
            csvContent += `ROE Compliance,${csvValue(instructorData.roe_compliance + " / 5")}\n`;
            csvContent += `Instructor Comments,${csvValue(instructorData.instructor_comments)}\n`;
            csvContent += `Instructor Name,${csvValue(instructorData.instructor_name)}\n`;
        }
        
        // Download trigger
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `BVR_Mission_Debrief_Report_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (err) {
        console.error("Error exporting CSV:", err);
        alert("Failed to export CSV telemetry data.");
    }
}

safeOnClick("export-csv-btn", exportMissionDataToCSV);
