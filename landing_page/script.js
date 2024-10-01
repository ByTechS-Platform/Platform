document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".side-nav .circle");
    const languageButtons = document.querySelectorAll('.language-switch button');
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressNumber = document.getElementById('progress-number');
    const burgerIcon = document.querySelector('.burger-icon');
    const burgerMenu = document.querySelector('.burger-menu');
    const duration = 5000; // 5 seconds for a full cycle
    let progressAnimationRunning = false; // Track if progress animation is running

    // Function to change active section based on scroll position
    function changeActiveSection() {
        let index = sections.length;

        // Find the current section by scrolling position
        while (--index && window.scrollY + 100 < sections[index].offsetTop) {}

        // Remove active classes from all nav links
        navLinks.forEach((link) => link.classList.remove("active", "contact-active"));

        // If the current section is 'contact', add the 'contact-active' class
        if (sections[index].id === 'contact') {
            navLinks.forEach((link) => link.classList.add("contact-active"));
        } else {
            navLinks[index].classList.add("active");
        }
    }

    // Function to toggle language (English/Arabic) without changing text direction
    function toggleLanguage() {
        const lang = this.classList.contains('Eng') ? 'en' : 'ar';

        // Update all elements that have language data attributes
        document.querySelectorAll('[data-en]').forEach((element) => {
            element.textContent = lang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-ar');
        });

        // Update the active button class
        languageButtons.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
    }

    // Function to animate the progress bar
    function animateProgressBar() {
        if (progressAnimationRunning) return; // Prevent multiple animations
        progressAnimationRunning = true;
        let startTime = null;

        function animateNumber(timestamp) {
            if (!startTime) startTime = timestamp;

            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const percentage = Math.floor(progress * 100);

            progressBar.style.width = `${percentage}%`;
            progressNumber.textContent = `${percentage}%`;

            if (elapsedTime < duration) {
                requestAnimationFrame(animateNumber);
            } else {
                progressAnimationRunning = false; // Animation complete
            }
        }

        requestAnimationFrame(animateNumber);
    }

    // Handle language switch
    languageButtons.forEach(button => button.addEventListener('click', toggleLanguage));

    // Detect section change on scroll
    changeActiveSection();
    window.addEventListener("scroll", changeActiveSection);

    // Animate the progress bar
    animateProgressBar();

    // Burger Menu Toggle functionality
    burgerIcon.addEventListener('click', function () {
        burgerIcon.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
});
