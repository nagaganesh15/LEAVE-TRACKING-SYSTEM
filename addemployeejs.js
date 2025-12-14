function allocateleaves(){
    let dept = document.getElementById('dept').value;
    let s=0,c=0,e=0,em=0;

    if(dept==='IT'){ s=10; c=5; e=12; em=2; }
    else if(dept==='HR'){ s=12; c=7; e=15; em=3; }
    else if(dept==='Finance'){ s=10; c=5; e=12; em=2; }
    else if(dept==='Sales'){ s=10; c=7; e=15; em=3; }
    else if(dept==='Marketing'){ s=10; c=6; e=14; em=2; }
    else if(dept==='Operations'){ s=10; c=5; e=12; em=2; }

    document.getElementById('sickleaves').value = s;
    document.getElementById('casualleaves').value = c;
    document.getElementById('earnedleaves').value = e;
    document.getElementById('emergencyleaves').value = em;
}

function storeempdetails(){
    let empdetails = JSON.parse(localStorage.getItem('storeempdetails')) || [];

    let empid = empidInput = document.getElementById('empid').value.trim();
    let empname = document.getElementById('empname').value.trim();
    let dept = document.getElementById('dept').value;

    if(empid==="" || empname==="" || dept===""){
        document.getElementById('res').innerHTML = "Fill all fields";
        document.getElementById('res').style.color = "red";
        return;
    }

    let exists = empdetails.some(e => e.empid === empid);
    if(exists){
        document.getElementById('res').innerHTML = "Employee ID already exists";
        document.getElementById('res').style.color = "red";
        return;
    }

    empdetails.push({
        empid,
        name: empname,
        dept,
        sickleaves: document.getElementById('sickleaves').value,
        casualleaves: document.getElementById('casualleaves').value,
        earnedleaves: document.getElementById('earnedleaves').value,
        emergencyleaves: document.getElementById('emergencyleaves').value
    });

    localStorage.setItem('storeempdetails', JSON.stringify(empdetails));

    document.getElementById('res').innerHTML = "Employee Added Successfully";
    document.getElementById('res').style.color = "green";

    document.getElementById('empid').value="";
    document.getElementById('empname').value="";
    document.getElementById('dept').value="";
    allocateleaves();
    
    setTimeout(() => {
        res.innerHTML = "";
    }, 1000);
}
