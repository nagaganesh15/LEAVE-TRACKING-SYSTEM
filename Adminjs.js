function search(){
    let name = document.getElementById('searchtext').value;
    let arr = JSON.parse(localStorage.getItem('storedata')) || [];
    let employees = JSON.parse(localStorage.getItem('storeempdetails')) || [];

    let filtered = arr.filter(item => {
        let emp = employees.find(e => e.empid === item.empid);
        return emp && emp.name.toLowerCase().includes(name.toLowerCase());
    });

    document.getElementById('searchtext').value = "";
    display(filtered);
}

function updatestatus(index, value){
    let arr = JSON.parse(localStorage.getItem('storedata')) || [];
    arr[index].status = value;
    localStorage.setItem('storedata', JSON.stringify(arr));
    display(arr);
}

function approveLeave(index){
    if(confirm("Do you want to APPROVE this leave request?")){
        updatestatus(index, "Approved");
    }
}

function rejectLeave(index){
    if(confirm("Do you want to REJECT this leave request?")){
        updatestatus(index, "Rejected");
    }
}

function updateComment(index, value){
    let arr = JSON.parse(localStorage.getItem('storedata')) || [];
    arr[index].comment = value;
    localStorage.setItem('storedata', JSON.stringify(arr));
}

function display(data, groupBy = "none"){
    let tablebody = document.getElementById('tbody');
    let count = 0, pencount = 0, appcount = 0, rejcount = 0;
    let employees = JSON.parse(localStorage.getItem('storeempdetails')) || [];
    tablebody.innerHTML = "";

    if(data.length === 0){
        tablebody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center; font-weight:bold; color:#777;">
                    No Leave Requests Found
                </td>
            </tr>`;
        document.getElementById('reqcount').innerText=0;
        document.getElementById('pencount').innerText=0;
        document.getElementById('appcount').innerText=0;
        document.getElementById('rejcount').innerText=0;
        return;
    }

    function updateCounts(item){
        count++;
        if(item.status==="Pending") pencount++;
        if(item.status==="Approved") appcount++;
        if(item.status==="Rejected") rejcount++;
    }

    function addRow(item,index){
        let emp = employees.find(e => e.empid === item.empid) || {name:"-", dept:"-"};
        let d1 = new Date(item.startdate);
        let d2 = new Date(item.enddate);
        let days = (d2-d1)/(1000*60*60*24)+1;

        tablebody.innerHTML += `
        <tr>
            <td>${item.empid}</td>
            <td>${emp.name}</td>
            <td>${emp.dept}</td>

            <td class="${
                item.leavetype==="Sick"?"sickcolor":
                item.leavetype==="Casual"?"casualcolor":
                item.leavetype==="Earned"?"earnedcolor":
                "emergencycolor"
            }">${item.leavetype}</td>

            <td>${item.startdate}</td>
            <td>${item.enddate}</td>
            <td>${days}</td>
            <td>${item.reason || "-"}</td>

            <td class="${
                item.status==="Pending"?"pendingcolor":
                item.status==="Approved"?"approvedcolor":
                "rejectedcolor"
            }">${item.status}</td>

            <td>
                ${
                    item.status==="Pending"
                    ? `<textarea onchange="updateComment(${index},this.value)"
                        placeholder="Enter comment...">${item.comment||""}</textarea>`
                    : (item.comment
                        ? `<div class="comment-text">${item.comment.replace(/\n/g,"<br>")}</div>`
                        : "-")
                }
            </td>

            <td>
                ${
                    item.status==="Pending"
                    ? `
                      <button onclick="approveLeave(${index})" style="background:#4caf50;">Approve</button>
                      <button onclick="rejectLeave(${index})" style="background:#f44336;">Reject</button>
                      `
                    : ""
                }
                <br><br>
                <button onclick="deleterow(${index})">Delete</button>
            </td>
        </tr>`;
    }

    if(groupBy === "employee"){
        let grouped = {};
        data.forEach(item=>{
            grouped[item.empid] = grouped[item.empid] || [];
            grouped[item.empid].push(item);
        });

        for(let empid in grouped){
            let emp = employees.find(e=>e.empid===empid) || {name:"-"};
            tablebody.innerHTML += `
                <tr class="group-heading">
                    <td colspan="11">Employee : ${emp.name} (${empid})</td>
                </tr>`;
            grouped[empid].forEach((item)=>{
                let index = JSON.parse(localStorage.getItem("storedata")).indexOf(item);
                addRow(item,index);
                updateCounts(item);
            });
        }
    }

    else if(groupBy === "department"){
        let grouped = {};
        data.forEach(item=>{
            let dept = (employees.find(e=>e.empid===item.empid)||{dept:"-"}).dept;
            grouped[dept] = grouped[dept] || [];
            grouped[dept].push(item);
        });

        for(let dept in grouped){
            tablebody.innerHTML += `
                <tr class="group-heading">
                    <td colspan="11">Department : ${dept}</td>
                </tr>`;
            grouped[dept].forEach((item)=>{
                let index = JSON.parse(localStorage.getItem("storedata")).indexOf(item);
                addRow(item,index);
                updateCounts(item);
            });
        }
    }

    else{
        data.forEach((item,index)=>{
            addRow(item,index);
            updateCounts(item);
        });
    }

    document.getElementById('reqcount').innerText=count;
    document.getElementById('pencount').innerText=pencount;
    document.getElementById('appcount').innerText=appcount;
    document.getElementById('rejcount').innerText=rejcount;
}


function changetype(){
    let type=document.getElementById("filter").value;
    document.getElementById("leavetype").style.display = type==="leavetype"?"inline-block":"none";
    document.getElementById("statustype").style.display = type==="status"?"inline-block":"none";
}

function applyfilter(){
    let arr=JSON.parse(localStorage.getItem("storedata"))||[];
    let type=document.getElementById("filter").value;
    let val= type==="leavetype" ? document.getElementById("leavetype").value : document.getElementById("statustype").value;

    if(val==="All") display(arr);
    else display(arr.filter(i=> type==="leavetype"?i.leavetype===val:i.status===val));
}

function applygrouping(){
    let arr = JSON.parse(localStorage.getItem("storedata")) || [];
    let groupBy = document.getElementById("groupby").value;
    display(arr, groupBy);
}


function deleterow(index){
    let arr=JSON.parse(localStorage.getItem("storedata"))||[];
    arr.splice(index,1);
    localStorage.setItem("storedata",JSON.stringify(arr));
    display(arr);
}

display(JSON.parse(localStorage.getItem("storedata"))||[]);
function search(){
    let name = document.getElementById('searchtext').value;
    let arr = JSON.parse(localStorage.getItem('storedata')) || [];
    let employees = JSON.parse(localStorage.getItem('storeempdetails')) || [];

    let filtered = arr.filter(item => {
        let emp = employees.find(e => e.empid === item.empid);
        return emp && emp.name.toLowerCase().includes(name.toLowerCase());
    });

    document.getElementById('searchtext').value = "";
    display(filtered);
}

function updatestatus(index, value){
    let arr = JSON.parse(localStorage.getItem('storedata')) || [];
    arr[index].status = value;
    localStorage.setItem('storedata', JSON.stringify(arr));
    display(arr);
}

function approveLeave(index){
    if(confirm("Do you want to APPROVE this leave request?")){
        updatestatus(index, "Approved");
    }
}

function rejectLeave(index){
    if(confirm("Do you want to REJECT this leave request?")){
        updatestatus(index, "Rejected");
    }
}

function updateComment(index, value){
    let arr = JSON.parse(localStorage.getItem('storedata')) || [];
    arr[index].comment = value;
    localStorage.setItem('storedata', JSON.stringify(arr));
}

function display(data, groupBy = "none"){
    let tablebody = document.getElementById('tbody');
    let count = 0, pencount = 0, appcount = 0, rejcount = 0;
    let employees = JSON.parse(localStorage.getItem('storeempdetails')) || [];
    tablebody.innerHTML = "";

    if(data.length === 0){
        tablebody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center; font-weight:bold; color:#777;">
                    No Leave Requests Found
                </td>
            </tr>`;
        document.getElementById('reqcount').innerText=0;
        document.getElementById('pencount').innerText=0;
        document.getElementById('appcount').innerText=0;
        document.getElementById('rejcount').innerText=0;
        return;
    }

    function updateCounts(item){
        count++;
        if(item.status==="Pending") pencount++;
        if(item.status==="Approved") appcount++;
        if(item.status==="Rejected") rejcount++;
    }

    function addRow(item,index){
        let emp = employees.find(e => e.empid === item.empid) || {name:"-", dept:"-"};
        let d1 = new Date(item.startdate);
        let d2 = new Date(item.enddate);
        let days = (d2-d1)/(1000*60*60*24)+1;

        tablebody.innerHTML += `
        <tr>
            <td>${item.empid}</td>
            <td>${emp.name}</td>
            <td>${emp.dept}</td>

            <td class="${
                item.leavetype==="Sick"?"sickcolor":
                item.leavetype==="Casual"?"casualcolor":
                item.leavetype==="Earned"?"earnedcolor":
                "emergencycolor"
            }">${item.leavetype}</td>

            <td>${item.startdate}</td>
            <td>${item.enddate}</td>
            <td>${days}</td>
            <td>${item.reason || "-"}</td>

            <td class="${
                item.status==="Pending"?"pendingcolor":
                item.status==="Approved"?"approvedcolor":
                "rejectedcolor"
            }">${item.status}</td>

            <td>
                ${
                    item.status==="Pending"
                    ? `<textarea onchange="updateComment(${index},this.value)"
                        placeholder="Enter comment...">${item.comment||""}</textarea>`
                    : (item.comment
                        ? `<div class="comment-text">${item.comment.replace(/\n/g,"<br>")}</div>`
                        : "-")
                }
            </td>

            <td>
                ${
                    item.status==="Pending"
                    ? `
                      <button onclick="approveLeave(${index})" style="background:#4caf50;">Approve</button>
                      <button onclick="rejectLeave(${index})" style="background:#f44336;">Reject</button>
                      `
                    : ""
                }
                <br><br>
                <button onclick="deleterow(${index})">Delete</button>
            </td>
        </tr>`;
    }

    if(groupBy === "employee"){
        let grouped = {};
        data.forEach(item=>{
            grouped[item.empid] = grouped[item.empid] || [];
            grouped[item.empid].push(item);
        });

        for(let empid in grouped){
            let emp = employees.find(e=>e.empid===empid) || {name:"-"};
            tablebody.innerHTML += `
                <tr class="group-heading">
                    <td colspan="11">Employee : ${emp.name} (${empid})</td>
                </tr>`;
            grouped[empid].forEach((item)=>{
                let index = JSON.parse(localStorage.getItem("storedata")).indexOf(item);
                addRow(item,index);
                updateCounts(item);
            });
        }
    }

    else if(groupBy === "department"){
        let grouped = {};
        data.forEach(item=>{
            let dept = (employees.find(e=>e.empid===item.empid)||{dept:"-"}).dept;
            grouped[dept] = grouped[dept] || [];
            grouped[dept].push(item);
        });

        for(let dept in grouped){
            tablebody.innerHTML += `
                <tr class="group-heading">
                    <td colspan="11">Department : ${dept}</td>
                </tr>`;
            grouped[dept].forEach((item)=>{
                let index = JSON.parse(localStorage.getItem("storedata")).indexOf(item);
                addRow(item,index);
                updateCounts(item);
            });
        }
    }

    else{
        data.forEach((item,index)=>{
            addRow(item,index);
            updateCounts(item);
        });
    }

    document.getElementById('reqcount').innerText=count;
    document.getElementById('pencount').innerText=pencount;
    document.getElementById('appcount').innerText=appcount;
    document.getElementById('rejcount').innerText=rejcount;
}


function changetype(){
    let type=document.getElementById("filter").value;
    document.getElementById("leavetype").style.display = type==="leavetype"?"inline-block":"none";
    document.getElementById("statustype").style.display = type==="status"?"inline-block":"none";
}

function applyfilter(){
    let arr=JSON.parse(localStorage.getItem("storedata"))||[];
    let type=document.getElementById("filter").value;
    let val= type==="leavetype" ? document.getElementById("leavetype").value : document.getElementById("statustype").value;

    if(val==="All") display(arr);
    else display(arr.filter(i=> type==="leavetype"?i.leavetype===val:i.status===val));
}

function applygrouping(){
    let arr = JSON.parse(localStorage.getItem("storedata")) || [];
    let groupBy = document.getElementById("groupby").value;
    display(arr, groupBy);
}


function deleterow(index){
    let arr=JSON.parse(localStorage.getItem("storedata"))||[];
    arr.splice(index,1);
    localStorage.setItem("storedata",JSON.stringify(arr));
    display(arr);
}

display(JSON.parse(localStorage.getItem("storedata"))||[]);
