function allocateleaves() {
    let dept = document.getElementById('dept').value;

    let s = 0, c = 0, e = 0, em = 0;

    if (dept === 'IT') {
        s = 10; c = 5; e = 12; em = 2;
    } else if (dept === 'HR') {
        s = 12; c = 7; e = 15; em = 3;
    } else if (dept === 'Finance') {
        s = 10; c = 5; e = 12; em = 2;
    } else if (dept === 'Sales') {
        s = 10; c = 7; e = 15; em = 3;
    } else if (dept === 'Marketing') {
        s = 10; c = 6; e = 14; em = 2;
    } else if (dept === 'Operations') {
        s = 10; c = 5; e = 12; em = 2;
    }

    document.getElementById('sickleaves').value = s;
    document.getElementById('casualleaves').value = c;
    document.getElementById('earnedleaves').value = e;
    document.getElementById('emergencyleaves').value = em;
}

function storeempdetails() {

    let empdetails = JSON.parse(localStorage.getItem('storeempdetails')) || [];

    let empid = document.getElementById('empid').value.trim();
    let empname = document.getElementById('empname').value.trim();
    let email = document.getElementById('email').value.trim();
    let dept = document.getElementById('dept').value;

    let res = document.getElementById('res');

    if (empid === "" || empname === "" || email === "" || dept === "") {
        res.innerHTML = "Please fill all fields";
        res.style.color = "red";
        return;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        res.innerHTML = "Please enter a valid email address";
        res.style.color = "red";
        return;
    }

    let exists = empdetails.some(emp => emp.empid === empid);
    if (exists) {
        res.innerHTML = "Employee ID already exists";
        res.style.color = "red";
        return;
    }

    empdetails.push({
        empid: empid,
        name: empname,
        email: email,
        dept: dept,
        sickleaves: document.getElementById('sickleaves').value,
        casualleaves: document.getElementById('casualleaves').value,
        earnedleaves: document.getElementById('earnedleaves').value,
        emergencyleaves: document.getElementById('emergencyleaves').value
    });

    localStorage.setItem('storeempdetails', JSON.stringify(empdetails));

    res.innerHTML = "Employee Added Successfully";
    res.style.color = "green";

    document.getElementById('empid').value = "";
    document.getElementById('empname').value = "";
    document.getElementById('email').value = "";
    document.getElementById('dept').value = "";

    allocateleaves(); 

    setTimeout(() => {
        res.innerHTML = "";
    }, 1500);
}
