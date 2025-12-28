let statusChart, leaveTypeChart, deptChart, trendChart;
let allLeaves = [];
let filteredLeaves = [];

function loadData() {
    allLeaves = JSON.parse(localStorage.getItem("storedata")) || [];
    filteredLeaves = [...allLeaves];
    updateDashboard();
}

function applyFilters() {
    const fromDate = document.getElementById("filterFromDate").value;
    const toDate = document.getElementById("filterToDate").value;
    const dept = document.getElementById("filterDept").value;
    const employees = JSON.parse(localStorage.getItem("storeempdetails")) || [];

    filteredLeaves = allLeaves.filter(leave => {
        let match = true;

        if (fromDate) {
            const leaveStart = new Date(leave.startdate);
            match = match && leaveStart >= new Date(fromDate);
        }

        if (toDate) {
            const leaveEnd = new Date(leave.enddate);
            match = match && leaveEnd <= new Date(toDate);
        }

        if (dept !== "All") {
            const emp = employees.find(e => e.empid === leave.empid);
            match = match && emp && emp.dept === dept;
        }

        return match;
    });

    updateDashboard();
}

function resetFilters() {
    document.getElementById("filterFromDate").value = "";
    document.getElementById("filterToDate").value = "";
    document.getElementById("filterDept").value = "All";
    filteredLeaves = [...allLeaves];
    updateDashboard();
}

function updateDashboard() {
    updateStats();
    updateCharts();
    updateTopEmployees();
}

function updateStats() {
    const total = filteredLeaves.length;
    const approved = filteredLeaves.filter(l => l.status === "Approved").length;
    const pending = filteredLeaves.filter(l => l.status === "Pending").length;
    const rejected = filteredLeaves.filter(l => l.status === "Rejected").length;
    
    const totalDays = filteredLeaves.reduce((sum, l) => sum + parseFloat(l.days || 0), 0);

    document.getElementById("totalRequests").textContent = total;
    document.getElementById("approvedLeaves").textContent = approved;
    document.getElementById("pendingLeaves").textContent = pending;
    document.getElementById("rejectedLeaves").textContent = rejected;
    document.getElementById("totalDays").textContent = totalDays.toFixed(1);
}

function updateCharts() {
    createStatusChart();
    createLeaveTypeChart();
    createDeptChart();
    createTrendChart();
}

function createStatusChart() {
    const ctx = document.getElementById("statusChart").getContext("2d");
    
    const pending = filteredLeaves.filter(l => l.status === "Pending").length;
    const approved = filteredLeaves.filter(l => l.status === "Approved").length;
    const rejected = filteredLeaves.filter(l => l.status === "Rejected").length;

    if (statusChart) statusChart.destroy();

    // Show chart even with 0 data
    const hasData = pending > 0 || approved > 0 || rejected > 0;
    const chartData = hasData ? [pending, approved, rejected] : [1, 1, 1];
    const chartColors = hasData 
        ? ['#ffc107', '#4caf50', '#f44336']
        : ['#e0e0e0', '#e0e0e0', '#e0e0e0'];

    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'Approved', 'Rejected'],
            datasets: [{
                data: chartData,
                backgroundColor: chartColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    enabled: hasData,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + (hasData ? context.parsed : 0);
                        }
                    }
                }
            }
        }
    });
}

function createLeaveTypeChart() {
    const ctx = document.getElementById("leaveTypeChart").getContext("2d");
    
    const types = {};
    filteredLeaves.forEach(l => {
        types[l.leavetype] = (types[l.leavetype] || 0) + 1;
    });

    if (leaveTypeChart) leaveTypeChart.destroy();


    const hasData = Object.keys(types).length > 0;
    const labels = hasData ? Object.keys(types) : ['No Data'];
    const data = hasData ? Object.values(types) : [1];
    const colors = hasData 
        ? ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40']
        : ['#e0e0e0'];

    leaveTypeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    enabled: hasData
                }
            }
        }
    });
}

function createDeptChart() {
    const ctx = document.getElementById("deptChart").getContext("2d");
    const employees = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    
    const depts = {};
    filteredLeaves.forEach(l => {
        const emp = employees.find(e => e.empid === l.empid);
        if (emp) {
            depts[emp.dept] = (depts[emp.dept] || 0) + 1;
        }
    });

    if (deptChart) deptChart.destroy();

    const hasData = Object.keys(depts).length > 0;
    const labels = hasData ? Object.keys(depts) : ['No Data'];
    const data = hasData ? Object.values(depts) : [0];

    deptChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Leave Requests',
                data: data,
                backgroundColor: hasData ? '#1e88e5' : '#e0e0e0'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: hasData
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createTrendChart() {
    const ctx = document.getElementById("trendChart").getContext("2d");
    
    const months = {};
    filteredLeaves.forEach(l => {
        const date = new Date(l.startdate);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        months[monthYear] = (months[monthYear] || 0) + 1;
    });

    const sortedMonths = Object.keys(months).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    const sortedData = sortedMonths.map(m => months[m]);

    if (trendChart) trendChart.destroy();

    // Show default chart if no data
    const hasData = sortedMonths.length > 0;
    const labels = hasData ? sortedMonths : ['No Data'];
    const data = hasData ? sortedData : [0];

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Leave Requests',
                data: data,
                borderColor: hasData ? '#1e88e5' : '#e0e0e0',
                backgroundColor: hasData ? 'rgba(30, 136, 229, 0.1)' : 'rgba(224, 224, 224, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: hasData
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateTopEmployees() {
    const employees = JSON.parse(localStorage.getItem("storeempdetails")) || [];
    const empStats = {};

    filteredLeaves.forEach(l => {
        if (!empStats[l.empid]) {
            empStats[l.empid] = { days: 0, requests: 0 };
        }
        empStats[l.empid].days += parseFloat(l.days || 0);
        empStats[l.empid].requests += 1;
    });

    const sorted = Object.entries(empStats)
        .sort((a, b) => b[1].days - a[1].days)
        .slice(0, 10);

    const tbody = document.getElementById("topEmployees");
    tbody.innerHTML = "";

    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No data available</td></tr>';
        return;
    }

    sorted.forEach(([empid, stats], index) => {
        const emp = employees.find(e => e.empid === empid) || { name: "-", dept: "-" };
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${empid}</td>
                <td>${emp.name}</td>
                <td>${emp.dept}</td>
                <td>${stats.days.toFixed(1)}</td>
                <td>${stats.requests}</td>
            </tr>
        `;
    });
}

loadData();
