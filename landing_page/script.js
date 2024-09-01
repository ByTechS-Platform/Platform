document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".side-nav .circle");
    const languageButtons = document.querySelectorAll('.language-switch button');
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressNumber = document.getElementById('progress-number');
    const duration = 5000; // 5 seconds for a full cycle

    function changeActiveSection() {
        let index = sections.length;

        while (--index && window.scrollY + 100 < sections[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove("active", "contact-active"));

        if (sections[index].id === 'contact') {
            navLinks.forEach((link) => link.classList.add("contact-active"));
        } else {
            navLinks[index].classList.add("active");
        }
    }

    function toggleLanguage() {
        const lang = this.classList.contains('Eng') ? 'en' : 'ar';
        const dir = lang === 'en' ? 'ltr' : 'rtl';

        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dir);

        document.querySelectorAll('[data-en]').forEach((element) => {
            if (lang === 'en') {
                element.textContent = element.getAttribute('data-en');
            } else {
                element.textContent = element.getAttribute('data-ar');
            }
        });

        languageButtons.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
    }

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
                startTime = null;
                requestAnimationFrame(animateNumber);
            }
        }

        requestAnimationFrame(animateNumber);
    }

    languageButtons.forEach(button => button.addEventListener('click', toggleLanguage));

    changeActiveSection();
    window.addEventListener("scroll", changeActiveSection);

    animateProgressBar();

    // Burger Menu Toggle
    const burgerIcon = document.querySelector('.burger-icon');
    const burgerMenu = document.querySelector('.burger-menu');

    burgerIcon.addEventListener('click', function () {
        burgerIcon.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
});
