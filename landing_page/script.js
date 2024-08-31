document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".side-nav .circle");
    const languageButtons = document.querySelectorAll('.language-switch button');
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressNumber = document.getElementById('progress-number');
    const duration = 5000; // 5 seconds for a full cycle

    // Function to update the active section in the side nav
    function changeActiveSection() {
        let index = sections.length;

        while (--index && window.scrollY + 100 < sections[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove("active", "contact-active"));

        // Add specific class for contact section
        if (sections[index].id === 'contact') {
            navLinks.forEach((link) => link.classList.add("contact-active"));
        } else {
            navLinks[index].classList.add("active");
        }
    }

    // Function to toggle language selection
    function toggleLanguage() {
        languageButtons.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
    }

    // Function to animate the progress bar and the number
    function animateProgressBar() {
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
                startTime = null; // Reset start time for infinite loop
                requestAnimationFrame(animateNumber);
            }
        }

        requestAnimationFrame(animateNumber);
    }

    // Attach event listeners to language buttons
    languageButtons.forEach(button => button.addEventListener('click', toggleLanguage));

    // Initial function calls
    changeActiveSection();
    window.addEventListener("scroll", changeActiveSection);

    // Start the progress bar animation
    animateProgressBar();
});
