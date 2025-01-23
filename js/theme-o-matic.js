// Ensure the theme is applied immediately upon page load
let currentThemeSetting = localStorage.getItem("theme") || "light";

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

// Apply the stored theme on page load
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

// Ensure the theme persists when using back/forward navigation
window.addEventListener("pageshow", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});