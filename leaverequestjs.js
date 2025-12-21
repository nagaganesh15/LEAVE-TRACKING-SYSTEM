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

function hasHolidayConflict(start, end) {
    let s = new Date(start);
    let e = new Date(end);

    for (let h of HOLIDAYS) {
        let holiday = new Date(h);
        if (holiday >= s && holiday <= e) {
            return true;
        }
    }
    return false;
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

    let empidEl = document.getElementById('empid');
    let leaveEl = document.getElementById('leave');
    let startEl = document.getElementById('startdate');
    let endEl = document.getElementById('enddate');
    let reasonEl = document.getElementById('reason');
    let res = document.getElementById('res');

    let empid = empidEl.value.trim();
    let leavetype = leaveEl.value;
    let startdate = startEl.value;
    let enddate = endEl.value;
    let reason = reasonEl.value;

    let employees = JSON.parse(localStorage.getItem('storeempdetails')) || [];
    let leaves = JSON.parse(localStorage.getItem('storedata')) || [];

    let employee = employees.find(emp => emp.empid === empid);

    if (empid === "") {
        res.innerHTML = "Please Enter Employee ID";
        res.style.color = "red";
        return;
    }

    if (!employee) {
        res.innerHTML = "Invalid Employee ID";
        res.style.color = "red";
        return;
    }

    if (leavetype === "") {
        res.innerHTML = "Please Select Leave Type";
        res.style.color = "red";
        return;
    }

    if (startdate === "" || enddate === "") {
        res.innerHTML = "Please Select Start and End Date";
        res.style.color = "red";
        return;
    }


    if (hasHolidayConflict(startdate, enddate)) {
        res.style.color = "red";
        res.innerHTML = "Leave Auto-Rejected due to Holiday Conflict";

        setTimeout(() => {
            res.innerHTML = "";
        }, 2500);
        return;
    }

     if (hasLeaveOverlap(empid, startdate, enddate, leaves)) {
        res.style.color = "red";
        res.innerHTML = "Leave Conflict: You already applied for leave on these dates";
        setTimeout(() => {
            res.innerHTML = "";
        }, 2500);
        return;
    }

    


    leaves.push({
        empid: empid,
        leavetype: leavetype,
        startdate: startdate,
        enddate: enddate,
        reason: reason,
        status: "Pending",
        comment: ""
    });

    localStorage.setItem('storedata', JSON.stringify(leaves));

    emailjs.send("service_bxa8ywt", "template_fj9bwz9", {
        to_email: employee.email,      
        emp_name: employee.name,
        leave_type: leavetype,
        start_date: startdate,
        end_date: enddate,
        status: "Pending"
    }).then(
        function () {
            res.style.color = "green";
            document.getElementById('res').innerHTML="Leave Request Submitted Successfully";
        },
        function (error) {
            res.style.color = "red";
            document.getElementById('res').innerHTML="Try Again";
        }
    );


    empidEl.value = "";
    leaveEl.value = "";
    startEl.value = "";
    endEl.value = "";
    reasonEl.value = "";

    setTimeout(() => {
        res.innerHTML = "";
    }, 2000);
    
}
