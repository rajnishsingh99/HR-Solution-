document.addEventListener("DOMContentLoaded", loadAttendance);

const users = {
    "admin": { role: "admin" },
    "E101": { role: "user", empID: "E101" }
};

function login() {
    var empID = document.getElementById("empID").value;
    if (users[empID]) {
        localStorage.setItem("loggedInUser", JSON.stringify(users[empID]));
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        if (users[empID].role === "admin") {
            document.getElementById("adminPanel").style.display = "block";
        }
    } else {
        alert("Invalid Employee ID!");
    }
}

function addEmployee() {
    var empName = document.getElementById("empName").value;
    var jobRole = document.getElementById("jobRole").value;
    var empID = "E" + (Object.keys(users).length + 100);
    users[empID] = { role: "user", empID: empID, name: empName, jobRole: jobRole };
    alert("Employee Added! ID: " + empID);
}

function markAttendance() {
    var empID = document.getElementById("attendanceEmpID").value;
    var hours = parseInt(document.getElementById("workingHours").value);
    var date = new Date().toLocaleDateString();

    var attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    attendance.push({ date, empID, hours });
    localStorage.setItem("attendance", JSON.stringify(attendance));

    loadAttendance();
}

function loadAttendance() {
    var table = document.getElementById("attendanceTable");
    var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];

    table.innerHTML = "<tr><th>Date</th><th>Employee ID</th><th>Working Hours</th></tr>";

    attendanceData.forEach(record => {
        var row = table.insertRow();
        row.insertCell(0).innerText = record.date;
        row.insertCell(1).innerText = record.empID;
        row.insertCell(2).innerText = record.hours;
    });
}

function generateMandaysReport() {
    var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    var csvContent = "Date,Employee ID,Mandays\n" +
        attendanceData.map(e => `${e.date},${e.empID},${(e.hours / 8).toFixed(2)}`).join("\n");

    downloadCSV(csvContent, "mandays_report.csv");
}

function generateHeadcountReport() {
    var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    var jobCount = {};
    attendanceData.forEach(record => {
        jobCount[record.empID] = (jobCount[record.empID] || 0) + 1;
    });

    var csvContent = "Employee ID,Job Count\n" +
        Object.keys(jobCount).map(empID => `${empID},${jobCount[empID]}`).join("\n");

    downloadCSV(csvContent, "headcount_report.csv");
}

function generateAttendanceReport() {
    var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    var csvContent = "Date,Employee ID,Working Hours\n" + 
        attendanceData.map(e => `${e.date},${e.empID},${e.hours}`).join("\n");

    downloadCSV(csvContent, "attendance_report.csv");
}

function downloadCSV(content, filename) {
    var blob = new Blob([content], { type: "text/csv" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
