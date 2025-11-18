function setMainPaddingTop() {
    const header = document.querySelector(".header");
    const main = document.querySelector("main");
    if (header && main) {
        const headerHeight = header.offsetHeight;
        main.style.paddingTop = headerHeight + "px";
        document.documentElement.style.scrollPaddingTop = headerHeight + "px";
    }
}

window.addEventListener("DOMContentLoaded", setMainPaddingTop);
window.addEventListener("resize", setMainPaddingTop);

const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navbar.classList.contains('open'));
    });

    navbar.querySelectorAll('.navlink').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    }); 
}