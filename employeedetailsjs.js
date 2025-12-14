function loadEmployees(){
    let empdetails = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    if(empdetails.length === 0){
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center; font-weight:bold; color:#777;">
                    No Employees Added
                </td>
            </tr>
        `;
        return;
    }

    for(let i=0;i<empdetails.length;i++){
        let emp = empdetails[i];

        tbody.innerHTML += `
        <tr>
            <td><input id="empid${i}" value="${emp.empid}" disabled></td>
            <td><input id="name${i}" value="${emp.name}" disabled></td>
            <td><input id="dept${i}" value="${emp.dept}" disabled></td>
            <td><input id="sick${i}" value="${emp.sickleaves}" disabled></td>
            <td><input id="casual${i}" value="${emp.casualleaves}" disabled></td>
            <td><input id="earned${i}" value="${emp.earnedleaves}" disabled></td>
            <td><input id="emergency${i}" value="${emp.emergencyleaves}" disabled></td>

            <td>
                <button class="editbtn" onclick="editEmployee(${i},this)">Edit</button>
            </td>

            <td>
                <button class="delbtn" onclick="deleteEmployee(${i})">Delete</button>
            </td>
        </tr>
        `;
    }
}

function editEmployee(index,btn){
    let empdetails = JSON.parse(localStorage.getItem("storeempdetails")) || [];

    let fields = [
        "empid","name","dept",
        "sick","casual","earned","emergency"
    ];

    if(btn.innerHTML=="Edit"){
        for(let f of fields){
            let input = document.getElementById(f+index);
            input.disabled = false;
            input.classList.add("editmode"); // show border
        }
        btn.innerHTML="Save";
    }
    else{
        empdetails[index].empid = document.getElementById("empid"+index).value;
        empdetails[index].name = document.getElementById("name"+index).value;
        empdetails[index].dept = document.getElementById("dept"+index).value;
        empdetails[index].sickleaves = document.getElementById("sick"+index).value;
        empdetails[index].casualleaves = document.getElementById("casual"+index).value;
        empdetails[index].earnedleaves = document.getElementById("earned"+index).value;
        empdetails[index].emergencyleaves = document.getElementById("emergency"+index).value;

        localStorage.setItem("storeempdetails",JSON.stringify(empdetails));
        loadEmployees();
    }
}

function deleteEmployee(index){
    let empdetails = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    empdetails.splice(index,1);
    localStorage.setItem("storeempdetails",JSON.stringify(empdetails));
    loadEmployees();
}

loadEmployees();

