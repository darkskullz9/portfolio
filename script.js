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