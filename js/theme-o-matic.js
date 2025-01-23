// Check if the user is opening a new tab
let currentThemeSetting = localStorage.getItem("theme");

// If no theme is set (new tab or no prior visit), default to "light"
if (!sessionStorage.getItem("visited")) {
    currentThemeSetting = "light";
    sessionStorage.setItem("visited", "true");
}

// Apply the current theme setting
function applyTheme(theme) {
    document.querySelector("html").setAttribute("data-theme", theme);
    const button = document.querySelector("[data-theme-o-matic]");
    if (button) {
        button.innerText = theme === "dark" ? "Light" : "Dark";
        button.setAttribute(
            "aria-label",
            `Change to ${theme === "dark" ? "light" : "dark"} theme`
        );
    }
}

// Apply the theme on page load
applyTheme(currentThemeSetting);

// Set up the theme toggle button
const button = document.querySelector("[data-theme-o-matic]");
if (button) {
    button.addEventListener("click", () => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        currentThemeSetting = newTheme;
        applyTheme(newTheme);
    });
}

// Reapply the theme during back/forward navigation
window.addEventListener("pageshow", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});