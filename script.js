// Local Storage se Attendance Load karna
document.addEventListener("DOMContentLoaded", loadAttendance);

function markAttendance() {
    var empID = document.getElementById("empID").value;
    var date = new Date().toLocaleDateString();

    if (empID) {
        var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
        attendanceData.push({ date: date, empID: empID });
        localStorage.setItem("attendance", JSON.stringify(attendanceData));
        loadAttendance();
    } else {
        alert("Please enter Employee ID!");
    }
}

function loadAttendance() {
    var table = document.getElementById("attendanceTable");
    var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];

    // Purana data clear karein
    table.innerHTML = "<tr><th>Date</th><th>Employee ID</th></tr>";

    attendanceData.forEach(record => {
        var row = table.insertRow();
        row.insertCell(0).innerText = record.date;
        row.insertCell(1).innerText = record.empID;
    });
}

// Report Download Karna
function generateReport() {
    var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    var csvContent = "Date,Employee ID\n" + attendanceData.map(e => `${e.date},${e.empID}`).join("\n");

    var blob = new Blob([csvContent], { type: "text/csv" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_report.csv";
    link.click();
}
