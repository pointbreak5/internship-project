function showTable() {

    document.getElementById("table")
        .style.display = "block";

}

function showTable() {

    let scenario =
        document.getElementById("sn").value;

    if (scenario.trim() == "") {

        document.getElementById("message")
            .innerHTML = "Please enter a scenario";

        return;
    }

    document.getElementById("message")
        .innerHTML = "";

    document.getElementById("table")
        .style.display = "block";
}