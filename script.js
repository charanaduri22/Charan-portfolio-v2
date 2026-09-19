/* ============================================================
   PORTFOLIO — Core JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- DOM Elements ----
    const header       = document.getElementById('site-header');
    const menuToggle   = document.getElementById('mobile-menu-toggle');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks  = document.querySelectorAll('.mobile-nav-link, .mobile-cta');
    const navLinks     = document.querySelectorAll('.nav-link');

    // ---- Header: scroll behaviour (show/hide + background) ----
    let lastScrollY  = 0;
    let ticking      = false;

    function onScroll() {
        const currentY = window.scrollY;

        // Add "scrolled" class after 50px for denser backdrop
        header.classList.toggle('scrolled', currentY > 50);

        // Hide header on scroll-down, show on scroll-up (after 300px)
        if (currentY > 300) {
            header.classList.toggle('hidden', currentY > lastScrollY);
        } else {
            header.classList.remove('hidden');
        }

        lastScrollY = currentY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });


    // ---- Mobile Menu Toggle ----
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileOverlay.classList.toggle('open');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('open');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    // ---- Active Nav Link on Scroll (Intersection Observer) ----
    const sections = document.querySelectorAll('section[id]');

    if (sections.length) {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${id}`
                        );
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }


    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--header-height')) || 80;

                window.scrollTo({
                    top: targetEl.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ---- Keyboard Accessibility: close mobile menu on Escape ----
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) {
            mobileOverlay.classList.remove('open');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.focus();
        }
    });


    // ---- Skill Bars: animate on scroll ----
    const skillBars = document.querySelectorAll('.skill-progress[data-width]');

    if (skillBars.length) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width');
                    // Small delay for staggered feel
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                        bar.classList.add('animated');
                    }, 150);
                    skillObserver.unobserve(bar);
                }
            });
        });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }
});
