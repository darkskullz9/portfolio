// === Theme Management ===
// Function to get the user's theme preference
function getThemePreference() {
    // Check local storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }

    // Otherwise, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
}

// Function to set the theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update aria-label for accessibility
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label',
            theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'
        );
    }
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize theme on page load
function initTheme() {
    const theme = getThemePreference();
    setTheme(theme);
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Event listener for theme toggle button
window.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});


// === Adjust main padding to header height ===
function setMainPaddingTop() {
    const header = document.querySelector(".header");
    const main = document.querySelector("main");
    if (header && main) {
        const headerHeight = header.offsetHeight;
        main.style.paddingTop = headerHeight + "px";
        document.documentElement.style.scrollPaddingTop = headerHeight + "px";
    }
}

// Initial call and event listener for window resize
window.addEventListener("DOMContentLoaded", setMainPaddingTop);
window.addEventListener("resize", setMainPaddingTop);


// === Hamburger Menu Toggle ===
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navbar.classList.contains('open'));
    });

    // Close navbar when a navlink is clicked (for single-page navigation)
    navbar.querySelectorAll('.navlink').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    }); 
}