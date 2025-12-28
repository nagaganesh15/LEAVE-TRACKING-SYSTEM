(function () {
    emailjs.init("Ydu64IM3gyrGbHmje");
})();

const HOLIDAYS = [
    "2025-12-25",
    "2026-01-01",
    "2026-01-26",
    "2026-08-15",
    "2026-10-02",
];

function handleLeaveType() {
    let leaveType = document.getElementById("leave").value;
    let halfDayEl = document.getElementById("halfday");

    if (
        leaveType === "Paternity" ||
        leaveType === "Maternity" ||
        leaveType === "Study"
    ) {
        halfDayEl.value = "No";
        halfDayEl.disabled = true;
    } else {
        halfDayEl.disabled = false;
    }

    updateEndDateForHalfDay();
}

function updateEndDateForHalfDay() {
    let halfDayEl = document.getElementById("halfday");
    let startEl = document.getElementById("startdate");
    let endEl = document.getElementById("enddate");

    let halfday = halfDayEl.value;
    let startdate = startEl.value;

    if (!startdate) return;

    if (halfday === "First Half" || halfday === "Second Half") {
        endEl.value = startdate;
        endEl.readOnly = true;
    } else {
        endEl.readOnly = false;
    }
}

function hasHolidayConflict(start, end) {
    let s = new Date(start);
    let e = new Date(end);

    return HOLIDAYS.some(h => {
        let holiday = new Date(h);
        return holiday >= s && holiday <= e;
    });
}

function hasLeaveOverlap(empid, start, end, leaves) {
    let newStart = new Date(start);
    let newEnd = new Date(end);

    return leaves.some(l => {
        if (l.empid !== empid) return false;

        let existingStart = new Date(l.startdate);
        let existingEnd = new Date(l.enddate);

        return newStart <= existingEnd && newEnd >= existingStart;
    });
}

function store(event) {
    event.preventDefault();

    let empidEl = document.getElementById("empid");
    let leaveEl = document.getElementById("leave");
    let halfDayEl = document.getElementById("halfday");
    let startEl = document.getElementById("startdate");
    let endEl = document.getElementById("enddate");
    let reasonEl = document.getElementById("reason");
    let res = document.getElementById("res");

    let empid = empidEl.value.trim();
    let leavetype = leaveEl.value;
    let halfday = halfDayEl.value;
    let startdate = startEl.value;
    let enddate = endEl.value;
    let reason = reasonEl.value;

    let employees = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    let leaves = JSON.parse(localStorage.getItem("storedata")) || [];

    let employee = employees.find(emp => emp.empid === empid);

    if (!empid) {
        res.innerHTML = "Please Enter Employee ID";
        res.style.color = "red";
        return;
    }

    if (!employee) {
        res.innerHTML = "Invalid Employee ID";
        res.style.color = "red";
        return;
    }

    if (!leavetype) {
        res.innerHTML = "Please Select Leave Type";
        res.style.color = "red";
        return;
    }

    if (!startdate || !enddate) {
        res.innerHTML = "Please Select Start and End Date";
        res.style.color = "red";
        return;
    }

    let numberOfDays;
    if (halfday === "First Half" || halfday === "Second Half") {
        numberOfDays = 0.5;
        enddate = startdate;
    } else {
        let d1 = new Date(startdate);
        let d2 = new Date(enddate);
        numberOfDays = (d2 - d1) / (1000 * 60 * 60 * 24) + 1;
    }

    if (hasHolidayConflict(startdate, enddate)) {
        res.innerHTML = "Leave Auto-Rejected due to Holiday Conflict";
        res.style.color = "red";
        return;
    }

    if (hasLeaveOverlap(empid, startdate, enddate, leaves)) {
        res.innerHTML = "Leave Conflict: Already applied for these dates";
        res.style.color = "red";
        return;
    }

    leaves.push({
        empid,
        leavetype,
        startdate,
        enddate,
        days: numberOfDays,
        halfday,
        reason,
        status: "Pending",
        comment: ""
    });

    localStorage.setItem("storedata", JSON.stringify(leaves));

    emailjs.send("service_bxa8ywt", "template_fj9bwz9", {
        to_email: employee.email,
        emp_name: employee.name,
        leave_type: `${leavetype} ${halfDayText}`,
        start_date: startdate,
        end_date: enddate,
        days: numberOfDays,
        status: "Pending"
    }).then(
        function () {
            res.style.color = "green";
            res.innerHTML = "Leave Request Submitted Successfully";
        },
        function () {
            res.style.color = "red";
            res.innerHTML = "Email Failed. Try Again";
        }
    );


    res.innerHTML = "Leave Request Submitted Successfully";
    res.style.color = "green";

    empidEl.value = "";
    leaveEl.value = "";
    halfDayEl.value = "No";
    halfDayEl.disabled = false;
    startEl.value = "";
    endEl.value = "";
    reasonEl.value = "";
    endEl.readOnly = false;

    setTimeout(() => res.innerHTML = "", 2500);
}
