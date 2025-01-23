// Set a default theme in the <html> tag immediately
const initialTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", initialTheme);

// Detect if it's a fresh tab (new session)
if (!sessionStorage.getItem("visited")) {
    sessionStorage.setItem("visited", "true");
    // Override to default to light mode on fresh tabs
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
}

// JavaScript function to apply a theme
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

// Apply the initial theme
applyTheme(initialTheme);

// Add event listener for theme toggle button
const button = document.querySelector("[data-theme-o-matic]");
if (button) {
    button.addEventListener("click", () => {
        const newTheme = initialTheme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        sessionStorage.setItem("visited", "true"); // Update session flag
        applyTheme(newTheme);
    });
}

// Handle back/forward navigation to maintain theme
window.addEventListener("pageshow", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});