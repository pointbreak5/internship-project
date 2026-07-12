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

        document.getElementById("mission-name").textContent =
            "Mission Name: " + data[0].aircraft_name;
        document.getElementById("satus").textContent =
            "Status: " + data[0].status;
        document.getElementById("date").textContent =
            "Date: " + data[0].flight_date.substring(0, 10);
        document.getElementById("duration").textContent =
            "Duration: " + data[0].duration;
        document.getElementById("aircraft-count").textContent =
            "Aircraft: " + data[0].aircraft_count;
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
