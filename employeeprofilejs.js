function loadProfileById() {
    let empid = document.getElementById("searchEmpId").value.trim();
    let employees = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    let leaves = JSON.parse(localStorage.getItem("storedata")) || [];

    let emp = employees.find(e => e.empid === empid);

    if (!emp) {
        alert("Employee not found");
        return;
    }

    // ✅ HIDE SEARCH CARD
    document.getElementById("searchCard").style.display = "none";

    // ✅ SHOW PROFILE SECTION
    document.getElementById("profileSection").style.display = "block";

    document.getElementById("eid").innerText = emp.empid;
    document.getElementById("ename").innerText = emp.name;
    document.getElementById("edept").innerText = emp.dept;

    document.getElementById("bsick").innerText = emp.sickleaves;
    document.getElementById("bcasual").innerText = emp.casualleaves;
    document.getElementById("bearned").innerText = emp.earnedleaves;
    document.getElementById("bemergency").innerText = emp.emergencyleaves;

    let history = document.getElementById("leavehistory");
    history.innerHTML = "";

    let empLeaves = leaves.filter(l => l.empid === empid);

    if (empLeaves.length === 0) {
        history.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">No Leave Records</td>
            </tr>`;
        return;
    }

    empLeaves.forEach((l, index) => {
        let globalIndex = leaves.indexOf(l);

        history.innerHTML += `
            <tr>
                <td>${l.leavetype}</td>
                <td>${l.startdate}</td>
                <td>${l.enddate}</td>
                <td>${l.days}</td>
                <td>${l.status}</td>
                <td>${l.comment || "-"}</td>
                <td>
                    ${
                        (l.status === "Pending" || l.status === "Approved")
                        ? `<button onclick="withdrawLeave(${globalIndex})">Withdraw</button>`
                        : "-"
                    }
                </td>
            </tr>
        `;
    });
}


/******** WITHDRAW LEAVE ********/
function withdrawLeave(index) {
    let leaves = JSON.parse(localStorage.getItem("storedata")) || [];

    if (!leaves[index]) return;

    if (!confirm("Are you sure you want to withdraw this leave?")) return;

    leaves[index].status = "Withdraw Requested";
    leaves[index].comment = "Employee requested withdrawal";

    localStorage.setItem("storedata", JSON.stringify(leaves));

    alert("Leave withdrawal request submitted");

    // Reload profile
    loadProfileById();
}
