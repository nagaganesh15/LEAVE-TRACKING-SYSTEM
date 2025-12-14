function loadProfileById(){
    let empId = document.getElementById("searchEmpId").value.trim();
    if(empId === ""){
        alert("Enter Employee ID");
        return;
    }

    let employees = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    let leaves = JSON.parse(localStorage.getItem("storedata")) || [];

    let emp = employees.find(e => e.empid == empId);
    if(!emp){
        alert("Employee not found");
        return;
    }

    document.getElementById("searchCard").style.display = "none";
    document.getElementById("profileSection").style.display = "block";

    showEmployeeProfile(emp, leaves);
}

function showEmployeeProfile(emp, leaves){

    document.getElementById("eid").innerText = emp.empid;
    document.getElementById("ename").innerText = emp.name;
    document.getElementById("edept").innerText = emp.dept;

    let sick = parseInt(emp.sickleaves);
    let casual = parseInt(emp.casualleaves);
    let earned = parseInt(emp.earnedleaves);
    let emergency = parseInt(emp.emergencyleaves);

    let historyHTML = "";

    leaves.forEach(l=>{
        if(l.empid == emp.empid){

            let d1 = new Date(l.startdate);
            let d2 = new Date(l.enddate);
            let days = (d2 - d1) / (1000*60*60*24) + 1;

            if(l.status === "Approved"){
                if(l.leavetype === "Sick") sick -= days;
                if(l.leavetype === "Casual") casual -= days;
                if(l.leavetype === "Earned") earned -= days;
                if(l.leavetype === "Emergency") emergency -= days;
            }

            historyHTML += `
                <tr>
                    <td>${l.leavetype}</td>
                    <td>${l.startdate}</td>
                    <td>${l.enddate}</td>
                    <td>${days}</td>
                    <td>${l.status}</td>
                    <td>${l.comment || "-"}</td>
                </tr>
            `;
        }
    });

    document.getElementById("leavehistory").innerHTML = historyHTML;
    document.getElementById("bsick").innerText = sick;
    document.getElementById("bcasual").innerText = casual;
    document.getElementById("bearned").innerText = earned;
    document.getElementById("bemergency").innerText = emergency;

}
