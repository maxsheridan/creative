// Detect if this is a fresh tab using sessionStorage
if (!sessionStorage.getItem("visited")) {
    sessionStorage.setItem("visited", "true"); // Mark this tab as visited
    localStorage.setItem("theme", "light"); // Force light mode on fresh tabs
}

// Get the current theme setting
let currentThemeSetting = localStorage.getItem("theme") || "light";

// Apply the theme immediately
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
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
        localStorage.setItem("theme", newTheme); // Save the preference
        currentThemeSetting = newTheme;
        applyTheme(newTheme);
    });
}

// Handle back/forward navigation to maintain the theme
window.addEventListener("pageshow", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});