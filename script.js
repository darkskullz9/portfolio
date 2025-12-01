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