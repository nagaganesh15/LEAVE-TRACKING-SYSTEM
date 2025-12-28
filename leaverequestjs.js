(function () {
    emailjs.init("Ydu64IM3gyrGbHmje");
})();

const HOLIDAYS = [
    "2025-12-25",
    "2026-01-01",
    "2026-01-26",
    "2026-08-15",
    "2026-10-02"
];

function handleLeaveType() {
    const leaveType = document.getElementById("leave").value;
    const halfDayEl = document.getElementById("halfday");

    if (leaveType === "Paternity" || leaveType === "Maternity" || leaveType === "Study") {
        halfDayEl.value = "No";
        halfDayEl.disabled = true;
    } else {
        halfDayEl.disabled = false;
    }

    updateEndDateForHalfDay();
}

function updateEndDateForHalfDay() {
    const halfDayEl = document.getElementById("halfday");
    const startEl = document.getElementById("startdate");
    const endEl = document.getElementById("enddate");

    if (!startEl.value) return;

    if (halfDayEl.value === "First Half" || halfDayEl.value === "Second Half") {
        endEl.value = startEl.value;
        endEl.readOnly = true;
    } else {
        endEl.readOnly = false;
    }
}

function hasHolidayConflict(start, end) {
    const s = new Date(start);
    const e = new Date(end);

    return HOLIDAYS.some(h => {
        const holiday = new Date(h);
        return holiday >= s && holiday <= e;
    });
}

function hasLeaveOverlap(empid, start, end, leaves) {
    const newStart = new Date(start);
    const newEnd = new Date(end);

    return leaves.some(l => {
        if (l.empid !== empid) return false;
        if (l.status === "Rejected" || l.status === "Withdraw Requested") return false;

        const existingStart = new Date(l.startdate);
        const existingEnd = new Date(l.enddate);

        return newStart <= existingEnd && newEnd >= existingStart;
    });
}

function store(event) {
    event.preventDefault();

    const empidEl = document.getElementById("empid");
    const leaveEl = document.getElementById("leave");
    const halfDayEl = document.getElementById("halfday");
    const startEl = document.getElementById("startdate");
    const endEl = document.getElementById("enddate");
    const reasonEl = document.getElementById("reason");
    const res = document.getElementById("res");

    const empid = empidEl.value.trim();
    const leavetype = leaveEl.value;
    const halfday = halfDayEl.value;
    let startdate = startEl.value;
    let enddate = endEl.value;
    const reason = reasonEl.value;

    const employees = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    const leaves = JSON.parse(localStorage.getItem("storedata")) || [];

    const employee = employees.find(emp => emp.empid === empid);

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

    if (new Date(enddate) < new Date(startdate)) {
        res.innerHTML = "End date cannot be before start date";
        res.style.color = "red";
        return;
    }

    let numberOfDays;

    if (halfday === "First Half" || halfday === "Second Half") {
        numberOfDays = 0.5;
        enddate = startdate;
    } else {
        const d1 = new Date(startdate);
        const d2 = new Date(enddate);
        numberOfDays = (d2 - d1) / (1000 * 60 * 60 * 24) + 1;
    }

    if (halfday === "No" && hasHolidayConflict(startdate, enddate)) {
        res.innerHTML = "Leave cannot be applied on holidays";
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
        leave_type: halfday === "No" ? leavetype : `${leavetype} (${halfday})`,
        start_date: startdate,
        end_date: enddate,
        days: numberOfDays,
        status: "Pending"
    }).then(
        () => {
            res.style.color = "green";
            res.innerHTML = "Leave Request Submitted Successfully";
            empidEl.value = "";
            leaveEl.value = "";
            halfDayEl.value = "No";
            halfDayEl.disabled = false;
            startEl.value = "";
            endEl.value = "";
            reasonEl.value = "";
            endEl.readOnly = false;
        },
        () => {
            res.style.color = "red";
            res.innerHTML = "Leave submitted but email failed";
        }
    );


    setTimeout(() => res.innerHTML = "", 3000);
}
