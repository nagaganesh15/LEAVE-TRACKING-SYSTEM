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

function display(data, groupBy="none"){
    let tablebody = document.getElementById('tbody');
    let count = 0, pencount = 0, appcount = 0, rejcount = 0;
    let employees = JSON.parse(localStorage.getItem('storeempdetails')) || [];
    tablebody.innerHTML="";

    if(data.length === 0){
        tablebody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center; font-weight:bold; color:#777;">
                    No Leave Requests Found
                </td>
            </tr>
        `;
        document.getElementById('reqcount').innerText=0;
        document.getElementById('pencount').innerText=0;
        document.getElementById('appcount').innerText=0;
        document.getElementById('rejcount').innerText=0;
        return;
    }

    data.forEach((item,index)=>{
        let emp = employees.find(e => e.empid === item.empid) || {name:"-", dept:"-"};
        let start = new Date(item.startdate);
        let end = new Date(item.enddate);
        let days = (end - start)/(1000*60*60*24) + 1;

        count++;
        if(item.status==="Pending") pencount++;
        if(item.status==="Approved") appcount++;
        if(item.status==="Rejected") rejcount++;

        tablebody.innerHTML += `
        <tr>
            <td>${item.empid}</td>
            <td>${emp.name}</td>
            <td>${emp.dept}</td>

            <!-- ✅ Leave type color FIXED -->
            <td class="${
                item.leavetype === 'Sick' ? 'sickcolor' :
                item.leavetype === 'Casual' ? 'casualcolor' :
                item.leavetype === 'Earned' ? 'earnedcolor' :
                'emergencycolor'
            }">${item.leavetype}</td>

            <td>${item.startdate}</td>
            <td>${item.enddate}</td>
            <td>${days}</td>
            <td>${item.reason || "-"}</td>

            <!-- Status color -->
            <td class="${
                item.status === 'Pending' ? 'pendingcolor' :
                item.status === 'Approved' ? 'approvedcolor' :
                'rejectedcolor'
            }">${item.status}</td>

            <td>
                ${
                    item.status === "Pending"
                    ? `<textarea placeholder="Enter comment..."
                        onchange="updateComment(${index},this.value)">${item.comment||""}</textarea>`
                    :(item.comment 
                        ? `<div class="comment-text">${item.comment.replace(/\n/g,"<br>")}</div>`
                        : "-")

                }
            </td>

            <!-- ✅ Action column FIXED -->
            <td>
                ${
                    item.status === "Pending"
                    ? `
                        <button onclick="approveLeave(${index})" style="background:#4caf50;">Approve</button>
                        <button onclick="rejectLeave(${index})" style="background:#f44336;">Reject</button>
                      `
                    : ""
                }
                <br><br>
                <button onclick="deleterow(${index})">Delete</button>
            </td>
        </tr>
        `;
    });

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
    display(JSON.parse(localStorage.getItem("storedata"))||[]);
}

function deleterow(index){
    let arr=JSON.parse(localStorage.getItem("storedata"))||[];
    arr.splice(index,1);
    localStorage.setItem("storedata",JSON.stringify(arr));
    display(arr);
}

display(JSON.parse(localStorage.getItem("storedata"))||[]);
