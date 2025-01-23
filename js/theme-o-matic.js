let currentThemeSetting = sessionStorage.getItem("theme") || "light";

function applyTheme(theme) {
    document.querySelector("html").setAttribute("data-theme", theme);
    const button = document.querySelector("[data-theme-o-matic]");
    button.innerText = theme === "dark" ? "Light" : "Dark";
}

applyTheme(currentThemeSetting);

const button = document.querySelector("[data-theme-o-matic]");
button.addEventListener("click", () => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
    sessionStorage.setItem("theme", newTheme);
    currentThemeSetting = newTheme;
    applyTheme(newTheme);
});

// Ensure theme persists when using back/forward buttons
window.addEventListener("pageshow", () => {
    const savedTheme = sessionStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});