function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById("themeIcon");

    if (body.getAttribute("data-theme") === "dark") {
        body.removeAttribute("data-theme");
        icon.className = "fa-regular fa-moon";
        localStorage.setItem("theme", "light");
    } else {
        body.setAttribute("data-theme", "dark");
        icon.className = "fa-regular fa-sun";
        localStorage.setItem("theme", "dark");
    }
}

window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.setAttribute("data-theme", "dark");
        document.getElementById("themeIcon").className = "fa-regular fa-sun";
    }
};
