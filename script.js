function markAttendance() {
    var empID = document.getElementById("empID").value;
    if (empID) {
        fetch("https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_URL/exec?empID=" + empID)
        .then(response => response.text())
        .then(data => {
            document.getElementById("message").innerText = data;
        })
        .catch(error => console.error("Error:", error));
    } else {
        alert("Please enter Employee ID!");
    }
}
