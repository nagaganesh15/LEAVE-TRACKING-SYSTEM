function search(){
    let name=document.getElementById('searchtext').value;
    let arr=JSON.parse(localStorage.getItem('storedata'))||[];
    let filteredarr=arr.filter(item=>{
        let employees=JSON.parse(localStorage.getItem('storeempdetails'))||[];
        let emp=employees.find(e=>e.empid===item.empid);
        let empname = emp ? emp.name : "";
        return empname.toLowerCase().includes(name.toLowerCase());
    });
    document.getElementById('searchtext').value="";
    display(filteredarr);
}

function updatestatus(index,value){
    let arr=JSON.parse(localStorage.getItem('storedata'))||[];
    arr[index].status=value;

    if(value !== "Pending"){
        arr[index].comment = arr[index].comment || "";
    }

    localStorage.setItem('storedata',JSON.stringify(arr));
    display(arr);
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

        document.getElementById('reqcount').innerText = 0;
        document.getElementById('pencount').innerText = 0;
        document.getElementById('appcount').innerText = 0;
        document.getElementById('rejcount').innerText = 0;
        return;
    }


    function addRow(item){
        let emp = employees.find(e => e.empid === item.empid) || {name:"-", dept:"-"};
        let start = new Date(item.startdate);
        let end = new Date(item.enddate);
        let days = (end - start) / (1000*60*60*24) + 1;
        let row = `
            <tr>
                <td>${item.empid}</td>
                <td>${emp.name}</td>
                <td>${emp.dept}</td>
                <td class="${
                    item.leavetype === 'Sick' ? 'sickcolor' :
                    item.leavetype === 'Casual' ? 'casualcolor' :
                    item.leavetype === 'Earned' ? 'earnedcolor' :
                    'emergencycolor'
                }">${item.leavetype}</td>
                <td>${item.startdate}</td>
                <td>${item.enddate}</td>
                <td>${days}</td>
                <td>${item.reason || ""}</td> <!-- moved here -->
                <td class="${
                    item.status === 'Pending' ? 'pendingcolor' :
                    item.status === 'Approved' ? 'approvedcolor' :
                    'rejectedcolor'
                }">
                    ${item.status === "Pending" ? `<select onchange="updatestatus(${data.indexOf(item)}, this.value)">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>` : item.status}
                </td>
                <td>
                ${
                    item.status === "Pending"
                    ? `<textarea 
                            placeholder="Enter comment..."
                            onchange="updateComment(${data.indexOf(item)}, this.value)"
                    >${item.comment || ""}</textarea>`
                    : (item.comment || "-")
                }
                </td>

                <td><button onclick="deleterow(${data.indexOf(item)})">Delete</button></td>
            </tr>
            `;

        tablebody.innerHTML += row;
    }

    function updateCounts(item){
        count++;
        if(item.status==='Pending') pencount++;
        if(item.status==='Approved') appcount++;
        if(item.status==='Rejected') rejcount++;
    }

    if(groupBy === "employee"){
        let grouped = {};
        data.forEach(item => {
            grouped[item.empid] = grouped[item.empid] || [];
            grouped[item.empid].push(item);
        });
        for(let empid in grouped){
            let emp = employees.find(e => e.empid === empid) || {name:"-", dept:"-"};
            tablebody.innerHTML += `<tr class="group-heading"><td colspan="11">Employee: ${emp.name} (${empid})</td></tr>`;
            grouped[empid].forEach(item => {
                addRow(item);
                updateCounts(item);
            });
        }
    } else if(groupBy === "department"){
        let grouped = {};
        data.forEach(item => {
            let dept = (employees.find(e => e.empid===item.empid)||{dept:'-'}).dept;
            grouped[dept] = grouped[dept] || [];
            grouped[dept].push(item);
        });
        for(let dept in grouped){
            tablebody.innerHTML += `<tr class="group-heading"><td colspan="11">Department: ${dept}</td></tr>`;
            grouped[dept].forEach(item => {
                addRow(item);
                updateCounts(item);
            });
        }
    } else {
        data.forEach(item => {
            addRow(item);
            updateCounts(item);
        });
    }

    document.getElementById('reqcount').innerText=count;
    document.getElementById('pencount').innerText=pencount;
    document.getElementById('appcount').innerText=appcount;
    document.getElementById('rejcount').innerText=rejcount;
}

function updateComment(index, value){
        let arr = JSON.parse(localStorage.getItem('storedata')) || [];
        arr[index].comment = value;
        localStorage.setItem('storedata', JSON.stringify(arr));
    }

function changetype(){
    let type=document.getElementById('filter').value;
    document.getElementById('statustype').style.display = (type === "status") ? 'block' : 'none';
    document.getElementById('leavetype').style.display = (type === "leavetype") ? 'block' : 'none';
}

function applyfilter(){
    let arr=JSON.parse(localStorage.getItem('storedata'))||[];
    let filtertype=document.getElementById('filter').value;
    let selectedvalue = (filtertype==='leavetype') ? document.getElementById('leavetype').value : document.getElementById('statustype').value;

    if(selectedvalue==='All') display(arr);
    else{
        let filteredarr = arr.filter(item=> filtertype==='leavetype' ? item.leavetype===selectedvalue : item.status===selectedvalue);
        display(filteredarr);
    }
}

function applygrouping(){
    let arr = JSON.parse(localStorage.getItem('storedata')) || [];
    display(arr, document.getElementById('groupby').value);
}

function deleterow(index){
    let arr=JSON.parse(localStorage.getItem('storedata'))||[];
    arr.splice(index,1);
    localStorage.setItem('storedata',JSON.stringify(arr));
    display(arr);
}

function load(){
    let arr=JSON.parse(localStorage.getItem('storedata'))||[];
    display(arr);
}
load();
