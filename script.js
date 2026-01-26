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

// Debounce function to optimize performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initial call and event listener for window resize
window.addEventListener("DOMContentLoaded", setMainPaddingTop);
window.addEventListener("resize", setMainPaddingTop);


// === Hamburger Menu Toggle ===
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

if (hamburger && navbar) {
    // Toggle menu on click
    hamburger.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);

        // Prevent body scroll when menu is open on mobile
        if (window.innerWidth < 900) {
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }
    });

    // Close navbar when a navlink is clicked (for single-page navigation)
    navbar.querySelectorAll('.navlink').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('open')) {
            navbar.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('open') && 
            !navbar.contains(e.target) && 
            !hamburger.contains(e.target)) {
                navbar.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
    });

    // Reset body overflow on window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth >= 900) {
            document.body.style.overflow = '';
            navbar.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }, 150));
}

// === Smooth Scroll for Navigation Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if href is just '#'
        if (href === '#' || href === '#hero-section') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth'});
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === Active Navigation Link Highlight ===
window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navlink[href^="#"]');

    function highLightNavigation() {
        const scrollPosition = window.scrollY + 100; // Offset for fixed header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Handle top of page
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }

    // Run on scroll with debounce
    window.addEventListener('scroll', debounce(highLightNavigation, 100));

    // Run once on load
    highLightNavigation();
});

// === Lazy Loading Images (Performance Optimization) ===
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// === Log page load performance ===
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});