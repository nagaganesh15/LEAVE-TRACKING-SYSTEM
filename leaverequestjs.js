function store(event){
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

    let employeeFound = employees.some(emp => emp.empid === empid);

    if(empid === ""){
        res.innerHTML = "Please Enter Employee ID";
        res.style.color = "red";
        return;
    }

    if(!employeeFound){
        res.innerHTML = "Invalid Employee ID";
        res.style.color = "red";
        return;
    }

    if(leavetype === ""){
        res.innerHTML = "Please Select Leave Type";
        res.style.color = "red";
        return;
    }

    if(startdate === "" || enddate === ""){
        res.innerHTML = "Please Select Start and End Date";
        res.style.color = "red";
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

    res.innerHTML = "Leave Request Submitted Successfully";
    res.style.color = "green";

    empidEl.value = "";
    leaveEl.value = "";
    startEl.value = "";
    endEl.value = "";
    reasonEl.value = "";

    setTimeout(() => {
        res.innerHTML = "";
    }, 1000);
}
