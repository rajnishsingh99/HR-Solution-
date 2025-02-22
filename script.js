document.addEventListener("DOMContentLoaded", loadAttendance);

// Dummy users
const users = {
    "admin": { role: "admin" },
    "user1": { role: "user", empID: "E101" }
};

// Login Function
function login() {
    var userID = document.getElementById("userID").value;
    if (users[userID]) {
        localStorage.setItem("loggedInUser", JSON.stringify(users[userID]));
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        if (users[userID].role === "admin") {
            document.getElementById("adminPanel").style.display = "block";
        }
    } else {
        alert("Invalid User ID!");
    }
}

// Add Employee
function addEmployee() {
    var name = document.getElementById("empName").value;
    var empID = document.getElementById("empID").value;
    var location = document.getElementById("empLocation").value;
    var role = document.getElementById("empRole").value;
    var subcontractor = document.getElementById("empSubcontractor").value;

    var employees = JSON.parse(localStorage.getItem("employees")) || [];
    employees.push({ name, empID, location, role, subcontractor });
    localStorage.setItem("employees", JSON.stringify(employees));

    alert("Employee Added!");
}

// Mark Attendance
function markAttendance() {
    var empID = document.getElementById("attendanceEmpID").value;
    var hours = parseInt(document.getElementById("workingHours").value);
    var date = new Date().toLocaleDateString();

    var attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    attendance.push({ date, empID, hours });
    localStorage.setItem("attendance", JSON.stringify(attendance));

    loadAttendance();
}

// Load Attendance Data
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

// Generate Report (Download CSV)
function generateReport() {
    var attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    var csvContent = "Date,Employee ID,Working Hours\n" + attendanceData.map(e => `${e.date},${e.empID},${e.hours}`).join("\n");

    var blob = new Blob([csvContent], { type: "text/csv" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_report.csv";
    link.click();
}
