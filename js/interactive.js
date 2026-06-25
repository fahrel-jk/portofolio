/* ============================================ */
/* INTERACTIVE ENHANCEMENTS                     */
/* Responsive interactivity for mobile & desktop */
/* Author: Fahrel Ilham Jaya Kusuma             */
/* ============================================ */

// ============================================
// UTILS: Device Detection
// ============================================
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const isMobile = window.innerWidth <= 768;
const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

// ============================================
// 1. TILT EFFECT ON CARDS (Desktop: mouse, Mobile: gyroscope)
// ============================================
(function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.project-card, .experience-card, .contact-card, .about-card');
    if (!tiltCards.length) return;

    if (!isTouchDevice) {
        // Desktop: Mouse-driven tilt
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                card.style.transition = 'transform 0.1s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                card.style.transition = 'transform 0.5s ease';
            });
        });
    } else {
        // Mobile: Gyroscope tilt (subtle)
        if (window.DeviceOrientationEvent) {
            let currentCard = null;

            tiltCards.forEach(card => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            currentCard = card;
                        }
                    });
                }, { threshold: 0.6 });
                observer.observe(card);
            });

            window.addEventListener('deviceorientation', (e) => {
                if (!currentCard) return;
                const gamma = e.gamma || 0; // left/right tilt
                const beta = e.beta || 0;   // front/back tilt
                const rotateY = Math.max(-5, Math.min(5, gamma * 0.15));
                const rotateX = Math.max(-5, Math.min(5, (beta - 45) * 0.1));
                currentCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }
    }
})();


// ============================================
// 2. RIPPLE EFFECT ON BUTTONS
// ============================================
(function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .btn-detail, .personal-badge, .contact-card, .exp-detail-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
})();


// ============================================
// 3. BACK-TO-TOP BUTTON WITH SCROLL PROGRESS
// ============================================
(function initBackToTop() {
    // Create back-to-top button
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `
        <svg class="progress-ring" width="52" height="52">
            <circle class="progress-ring-bg" cx="26" cy="26" r="23" />
            <circle class="progress-ring-fill" cx="26" cy="26" r="23" />
        </svg>
        <i class="fa-solid fa-arrow-up"></i>
    `;
    document.body.appendChild(btn);

    const circle = btn.querySelector('.progress-ring-fill');
    const circumference = 2 * Math.PI * 23;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        const offset = circumference - (progress * circumference);
        circle.style.strokeDashoffset = offset;

        if (scrollTop > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


// ============================================
// 4. MOBILE BOTTOM NAVIGATION
// ============================================
(function initMobileBottomNav() {
    if (window.innerWidth > 768) return;

    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.id = 'mobile-bottom-nav';

    const navItems = [
        { href: '#home', icon: 'fa-solid fa-house', label: 'Home' },
        { href: '#about', icon: 'fa-solid fa-user', label: 'About' },
        { href: '#skill', icon: 'fa-solid fa-code', label: 'Skills' },
        { href: '#project', icon: 'fa-solid fa-folder-open', label: 'Projects' },
        { href: '#contact', icon: 'fa-solid fa-paper-plane', label: 'Contact' },
    ];

    navItems.forEach(item => {
        const a = document.createElement('a');
        a.href = item.href;
        a.className = 'bottom-nav-item';
        a.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(item.href);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
            }
        });
        bottomNav.appendChild(a);
    });

    document.body.appendChild(bottomNav);

    // Active state based on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        const allItems = bottomNav.querySelectorAll('.bottom-nav-item');

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });

    // Show/hide based on scroll direction
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > lastScrollY && window.scrollY > 300) {
                    bottomNav.classList.add('hidden');
                } else {
                    bottomNav.classList.remove('hidden');
                }
                lastScrollY = window.scrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();


// ============================================
// 5. TOUCH-FRIENDLY SKILL CARDS (Tap to flip on mobile)
// ============================================
(function initTouchSkillCards() {
    if (!isTouchDevice) return;

    const skillCards = document.querySelectorAll('.skill-image-card');
    let activeCard = null;

    skillCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();

            if (activeCard && activeCard !== card) {
                activeCard.classList.remove('touch-active');
            }

            card.classList.toggle('touch-active');
            activeCard = card.classList.contains('touch-active') ? card : null;
        });
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
        if (activeCard && !e.target.closest('.skill-image-card')) {
            activeCard.classList.remove('touch-active');
            activeCard = null;
        }
    });
})();


// ============================================
// 6. MAGNETIC EFFECT ON BUTTONS (Desktop)
// ============================================
(function initMagneticButtons() {
    if (isTouchDevice) return;

    const magneticElements = document.querySelectorAll('.btn-primary, .hero-social-link, .contact-icon');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            el.style.transition = 'transform 0.2s ease';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.5s ease';
        });
    });
})();


// ============================================
// 7. SMOOTH SECTION REVEAL (Enhanced scroll)
// ============================================
(function initSectionReveal() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
                // Add stagger animation to children
                const children = entry.target.querySelectorAll('.glass-card, .project-card, .contact-card, .personal-badge, .cert-card');
                children.forEach((child, i) => {
                    child.style.transitionDelay = `${i * 0.08}s`;
                    child.classList.add('element-revealed');
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(s => observer.observe(s));
})();


// ============================================
// 8. INTERACTIVE TEXT HOVER (Desktop — Hero name glitch)
// ============================================
(function initTextHoverEffect() {
    if (isTouchDevice) return;

    const heroNameLines = document.querySelectorAll('.hero-name-line');
    heroNameLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            line.classList.add('text-glitch');
            setTimeout(() => line.classList.remove('text-glitch'), 300);
        });
    });
})();


// ============================================
// 9. PULL-TO-REFRESH STYLE ANIMATION (Mobile Hero)
// ============================================
(function initMobileHeroInteraction() {
    if (!isTouchDevice) return;

    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (!hero || !heroImage) return;

    let startY = 0;
    let currentY = 0;

    hero.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    hero.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0 && window.scrollY === 0) {
            const pull = Math.min(diff * 0.3, 40);
            heroImage.style.transform = `scale(${1 + pull * 0.002}) translateY(${pull * 0.5}px)`;
        }
    }, { passive: true });

    hero.addEventListener('touchend', () => {
        heroImage.style.transform = '';
        heroImage.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
            heroImage.style.transition = '';
        }, 500);
    });
})();


// ============================================
// 10. SCROLL-DRIVEN NAVBAR PROGRESS BAR
// ============================================
(function initNavProgress() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'nav-scroll-progress';
    navbar.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }, { passive: true });
})();


// ============================================
// 11. TOUCH FEEDBACK — Press & Hold effect
// ============================================
(function initTouchFeedback() {
    if (!isTouchDevice) return;

    const interactiveEls = document.querySelectorAll('.btn, .contact-card, .project-card, .experience-card, .personal-badge, .cert-card');

    interactiveEls.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.classList.add('touch-pressed');
        }, { passive: true });

        el.addEventListener('touchend', () => {
            el.classList.remove('touch-pressed');
        });

        el.addEventListener('touchcancel', () => {
            el.classList.remove('touch-pressed');
        });
    });
})();


// ============================================
// 12. PARALLAX ON SCROLL (Both devices)
// ============================================
(function initParallaxSections() {
    const parallaxBgs = document.querySelectorAll('.about, .skills, .experience, .contact');

    if (isTouchDevice) {
        // Simpler parallax for mobile (performance)
        return;
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        parallaxBgs.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.05;
                const yPos = (rect.top * speed);
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    }, { passive: true });
})();


// ============================================
// 13. DYNAMIC GREETING BASED ON TIME
// ============================================
(function initDynamicGreeting() {
    const greetingEl = document.querySelector('.hero-greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greeting = "HELLO, I'M";

    if (hour >= 5 && hour < 12) {
        greeting = "GOOD MORNING, I'M";
    } else if (hour >= 12 && hour < 17) {
        greeting = "GOOD AFTERNOON, I'M";
    } else if (hour >= 17 && hour < 21) {
        greeting = "GOOD EVENING, I'M";
    } else {
        greeting = "GOOD NIGHT, I'M";
    }

    greetingEl.textContent = greeting;
})();


// ============================================
// 14. RESPONSIVE WINDOW RESIZE HANDLER
// ============================================
(function initResizeHandler() {
    let resizeTimer;

    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
})();
