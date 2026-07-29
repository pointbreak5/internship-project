
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
fetch("http://localhost:3000/performance")
    .then(response => response.json())
    .then(data => {
        if (!data || data.length === 0) return;
        const performance = data[0];

        const accuracyValEl = document.getElementById("accuracy-value");
        if (accuracyValEl) accuracyValEl.textContent = performance.accuracy + "%";

        const efficiencyValEl = document.getElementById("efficiency-value");
        if (efficiencyValEl) efficiencyValEl.textContent = performance.efficiency + "%";

        const survivabilityValEl = document.getElementById("survivability-value");
        if (survivabilityValEl) survivabilityValEl.textContent = performance.survivability + "%";

        //to make the circle dynamic
        const accuracyCircleEl = document.getElementById("accuracy-circle");
        if (accuracyCircleEl) accuracyCircleEl.style.setProperty("--progress", performance.accuracy + "%");

        const efficiencyCircleEl = document.getElementById("efficiency-circle");
        if (efficiencyCircleEl) efficiencyCircleEl.style.setProperty("--progress", performance.efficiency + "%");

        const survivabilityCircleEl = document.getElementById("survivability-circle");
        if (survivabilityCircleEl) survivabilityCircleEl.style.setProperty("--progress", performance.survivability + "%");
    });
//fetching objective assessment
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

            row.innerHTML = `
                <td>${item.objective}</td>
                <td>${item.weight}</td>
                <td><span class="${statusClass}">${item.status}</span></td>
                <td>${item.score}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error(error);
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

//coomunication
async function loadCommunicationLog() {
    try {
        const response = await fetch("http://localhost:3000/api/communication-log");
        const data = await response.json();
        const tbody = document.getElementById("communication-body");
        if (!tbody) return;
        tbody.innerHTML = "";

        data.forEach(log => {
            tbody.innerHTML += `
                <tr>
                    <td>${log.timestamp}</td>
                    <td>${log.sender}</td>
                    <td>${log.receiver}</td>
                    <td>${log.message}</td>
                    <td>${log.status}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
    }
}

loadCommunicationLog();

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

    catch (err) {

        console.log(err);

    }

}

loadDecisionPoints();

const overviewContainer = document.getElementById("map");

if (overviewContainer) {

    const map = L.map(overviewContainer).setView([22, 70], 4);

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

            map.fitBounds(mapLayer.getBounds());

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
document.getElementById("edit-btn").onclick = function () {

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
};

//cancel
document.getElementById("cancelBtn").onclick = function () {
    document.getElementById("editModal").style.display = "none";
};

//save
document.getElementById("saveBtn").onclick = function () {
    document.getElementById("editModal").style.display = "none";

    document.getElementById("mission-name").textContent =
        document.getElementById("edit-name").value;
};