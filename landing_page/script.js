document.addEventListener("DOMContentLoaded", function () {
    // ============================================
    // Variable Declarations
    // ============================================

    // Navigation elements
    const nav = document.querySelector('nav');
    const navLogo = nav.querySelector('.logo');
    const languageButtonsNav = nav.querySelectorAll('.language-switch button');

    // Burger menu elements
    const burgerIcon = document.querySelector('.burger-icon');
    const burgerMenu = document.querySelector('.burger-menu');
    const languageButtonsBurger = burgerMenu.querySelectorAll('.language-switch button');

    // Language switch buttons (both in nav and burger menu)
    const languageButtons = document.querySelectorAll('.language-switch button');

    // Sections and side navigation
    const sections = document.querySelectorAll("section");
    const sideNavLinks = document.querySelectorAll(".side-nav .circle");

    // Progress bar elements
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressNumber = document.getElementById('progress-number');

    // ============================================
    // Functions
    // ============================================

    /**
     * Updates the active section based on scroll position.
     * Adjusts the side navigation and navbar styles accordingly.
     */
    function changeActiveSection() {
        let index = sections.length;

        // Find the current section based on scroll position
        while (--index && window.scrollY + 100 < sections[index].offsetTop) {}

        // Remove active classes from all side nav links
        sideNavLinks.forEach((link) => link.classList.remove("active", "contact-active"));

        // If the current section is 'contact', add the 'contact-active' class to all side nav links
        if (sections[index].id === 'contact') {
            sideNavLinks.forEach((link) => link.classList.add("contact-active"));
        } else {
            // Otherwise, activate the corresponding side nav link
            sideNavLinks[index].classList.add("active");
        }

        // Handle navbar changes based on section background color
        const currentSection = sections[index];
        const bgColor = window.getComputedStyle(currentSection).backgroundColor;
        const isWhiteBackground = bgColor === 'rgb(255, 255, 255)';

        if (isWhiteBackground) {
            // Switch navbar to light mode
            nav.classList.add('light-mode');
            // Change logo to color version
            navLogo.src = 'assets/BytechsColor.png';
        } else {
            // Revert navbar to default (dark mode)
            nav.classList.remove('light-mode');
            // Revert logo to default
            navLogo.src = 'assets/logo.png';
        }

        // Update language switch button colors in navbar
        updateLanguageButtonColors();
    }

    /**
     * Toggles the language between English and Arabic.
     * Updates text content of elements with data attributes and adjusts button states.
     */
    function toggleLanguage() {
        const lang = this.classList.contains('Eng') ? 'en' : 'ar';

        // Update all elements that have language data attributes
        document.querySelectorAll('[data-en]').forEach((element) => {
            element.textContent = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-ar');
        });

        // Update the active button class for all language buttons
        languageButtons.forEach(button => button.classList.remove('active'));

        // Activate the clicked button (both in nav and burger menu)
        const buttonsToActivate = document.querySelectorAll(`.language-switch button.${lang === 'en' ? 'Eng' : 'AR'}`);
        buttonsToActivate.forEach(button => button.classList.add('active'));

        // Update language switch button colors in navbar
        updateLanguageButtonColors();
    }

    /**
     * Updates the language switch button colors in the navbar based on the current mode.
     */
    function updateLanguageButtonColors() {
        if (nav.classList.contains('light-mode')) {
            languageButtonsNav.forEach(button => {
                if (button.classList.contains('active')) {
                    button.style.color = '#5552E1';
                } else {
                    button.style.color = 'black';
                }
            });
        } else {
            languageButtonsNav.forEach(button => {
                button.style.color = ''; // Revert to default
            });
        }
    }

    /**
     * Animates the progress bar and percentage number in a continuous loop.
     */
    function animateProgressBar() {
        let startTime = null;
        const duration = 5030; // 5 seconds for a full cycle

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;

            const elapsedTime = timestamp - startTime;
            const progress = (elapsedTime % duration) / duration; // Use modulo to loop
            const percentage = Math.floor(progress * 100);

            progressBar.style.width = `${percentage}%`;
            progressNumber.textContent = `${percentage}%`;

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    /**
     * Toggles the burger menu visibility.
     */
    function toggleBurgerMenu() {
        burgerIcon.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    }

    // ============================================
    // Event Listeners
    // ============================================

    // Handle language switch button clicks
    languageButtons.forEach(button => button.addEventListener('click', toggleLanguage));

    // Update active section and navbar styles on scroll
    window.addEventListener("scroll", changeActiveSection);

    // Initialize the active section and navbar styles on page load
    changeActiveSection();

    // Start animating the progress bar
    animateProgressBar();

    // Burger menu toggle functionality
    burgerIcon.addEventListener('click', toggleBurgerMenu);
});
