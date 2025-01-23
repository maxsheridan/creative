// Ensure the theme is applied immediately upon page load or refresh
let currentThemeSetting = sessionStorage.getItem("theme") || "light";

function applyTheme(theme) {
    document.querySelector("html").setAttribute("data-theme", theme);
    const button = document.querySelector("[data-theme-o-matic]");
    if (button) {
        button.innerText = theme === "dark" ? "Light" : "Dark";
    }
}

// Apply the theme stored in sessionStorage on page load
applyTheme(currentThemeSetting);

// Set up the theme toggle button
const button = document.querySelector("[data-theme-o-matic]");
if (button) {
    button.addEventListener("click", () => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
        sessionStorage.setItem("theme", newTheme);
        currentThemeSetting = newTheme;
        applyTheme(newTheme);
    });
}

// Ensure the theme persists when using the back/forward buttons
window.addEventListener("pageshow", () => {
    const savedTheme = sessionStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});