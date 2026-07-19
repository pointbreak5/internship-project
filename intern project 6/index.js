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

        document.getElementById("mission-name").textContent = data[0].aircraft_name;
        const statusText = data[0].status;
        if (statusText === "Completed") {
            document.getElementById("satus").innerHTML = '<span class="status-completed">Completed</span>';
        } else if (statusText === "In Progress") {
            document.getElementById("satus").innerHTML = '<span class="status-in-progress">In Progress</span>';
        } else if (statusText === "Failed") {
            document.getElementById("satus").innerHTML = '<span class="status-failed">Failed</span>';
        } else if (statusText === "Aborted") {
            document.getElementById("satus").innerHTML = '<span class="status-aborted">Aborted</span>';
        } else {
            document.getElementById("satus").textContent = statusText;
        }

        document.getElementById("date").textContent = data[0].flight_date.substring(0, 10);
        document.getElementById("duration").textContent = data[0].duration;
        document.getElementById("aircraft-count").textContent = data[0].aircraft_count;
    })
    .catch(error => {
        console.error(error);
    });



//connecting performance metric data
fetch("http://localhost:3000/performance")
    .then(response => response.json())
    .then(data => {

        const performance = data[0];

        document.getElementById("accuracy-value").textContent =
            performance.accuracy + "%";

        document.getElementById("efficiency-value").textContent =
            performance.efficiency + "%";

        //to make the circle dynamic
        document.getElementById("accuracy-circle")
            .style.setProperty("--progress", performance.accuracy + "%");

        document.getElementById("efficiency-circle")
            .style.setProperty("--progress", performance.efficiency + "%");

    });
//fetching objective assessment
fetch("http://localhost:3000/objectives")
    .then(response => response.json())
    .then(data => {

        const tableBody = document.getElementById("objective-body");
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

        document.getElementById("operational-awareness").textContent =
            data.operational_awareness + " / 5";

        document.getElementById("tactical-decision").textContent =
            data.tactical_decision_making + " / 5";

        document.getElementById("communication").textContent =
            data.communication + " / 5";

        document.getElementById("roe-compliance").textContent =
            data.roe_compliance + " / 5";

        document.getElementById("instructor-comments").textContent =
            data.instructor_comments;

        document.getElementById("instructor-name").textContent =
            data.instructor_name;

        // Calculate Overall Rating
        const overall =
            (
                data.operational_awareness +
                data.tactical_decision_making +
                data.communication +
                data.roe_compliance
            ) / 4;

        document.getElementById("overall-rating").textContent =
            overall.toFixed(1) + " / 5";

        const roundedRating = Math.round(overall);

        let stars = "";

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars += "★";
            } else {
                stars += "☆";
            }
        }

        document.getElementById("stars").textContent = stars;

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

        const container =
            document.getElementById("timeline-container");

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