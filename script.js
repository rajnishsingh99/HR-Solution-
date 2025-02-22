document.addEventListener("DOMContentLoaded", loadAttendance);

const users = {
    "admin": { role: "admin" },
    "E101": { role: "user", empID: "E101" }
};

const employees = [];

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
    var jobLocation = document.getElementById("jobLocation").value;
    var subcontractor = document.getElementById("subcontractor").value;
    var empID = "E" + (employees.length + 101);
    
    employees.push({ empID, empName, jobRole, jobLocation, subcontractor });
    alert("Employee Added! ID: " + empID);
    updateLocationGraph();
}

function markAttendance() {
    var empID = document.getElementById("attendanceEmpID").value;
    if (!employees.find(emp => emp.empID === empID)) {
        alert("Employee not found! Please add employee first.");
        return;
    }
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

function updateLocationGraph() {
    var ctx = document.getElementById("locationChart").getContext("2d");
    var locations = {};
    employees.forEach(emp => {
        locations[emp.jobLocation] = (locations[emp.jobLocation] || 0) + 1;
    });

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(locations),
            datasets: [{ label: "Employees", data: Object.values(locations), backgroundColor: "blue" }]
        }
    });
}
