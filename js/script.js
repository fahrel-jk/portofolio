/* ============================================ */
/* PORTFOLIO — Main JavaScript                  */
/* Author: Fahrel Ilham Jaya Kusuma             */
/* ============================================ */

// ============================================
// 1. LOADING SCREEN
// ============================================
(function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    document.body.classList.add('loading');

    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
        }
        loadingBar.style.width = progress + '%';
    }, 150);

    window.addEventListener('load', () => {
        const minDuration = 2000;
        const elapsed = performance.now();
        const remaining = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
            loadingBar.style.width = '100%';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.classList.remove('loading');
                setTimeout(() => loadingScreen.remove(), 600);
            }, 300);
        }, remaining);
    });
})();


// ============================================
// 2. CUSTOM CURSOR (Desktop Only)
// ============================================
(function initCustomCursor() {
    if (window.innerWidth <= 1024) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = 'a, button, .btn, .project-card, .contact-card, .cert-card, .skill-image-card, .experience-card, .personal-badge';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
})();


// ============================================
// 3. NAVIGATION
// ============================================
(function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll — add/remove scrolled class
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll spy — active link
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Scroll indicator
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#about');
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    }
})();


// ============================================
// 4. PARTICLE SYSTEM (Hero Background)
// ============================================
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 120;
    let animId = null;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initParticleArray() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(88, 246, 232, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(88, 246, 232, ${p.opacity})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        animId = requestAnimationFrame(drawParticles);
    }

    resize();
    initParticleArray();
    drawParticles();

    window.addEventListener('resize', () => {
        resize();
        initParticleArray();
    });

    // Pause when not visible
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animId) drawParticles();
                } else {
                    if (animId) {
                        cancelAnimationFrame(animId);
                        animId = null;
                    }
                }
            });
        }, { threshold: 0.1 });
        observer.observe(heroSection);
    }
})();


// ============================================
// 5. TYPED TEXT EFFECT
// ============================================
(function initTypedText() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;

    const roles = ['Web Developer', 'UI/UX Enthusiast', 'Game Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else {
                typingSpeed = 80 + Math.random() * 40;
            }
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400;
            } else {
                typingSpeed = 40;
            }
        }

        setTimeout(type, typingSpeed);
    }

    // Start after loading screen finishes
    setTimeout(type, 2500);
})();


// ============================================
// 6. COUNTER ANIMATION (About Stats)
// ============================================
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    let animated = false;

    function animateCounters() {
        if (animated) return;
        animated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(easeOut * target);
                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        });
    }

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(aboutStats);
    }
})();


// ============================================
// 7. PROJECT MODAL
// ============================================
(function initProjectModal() {
    const projectData = {
        1: {
            title: 'Pemrogaman Api Vokatif',
            image: 'img/vokatif.png',
            description: 'Platform manajemen event berbasis web yang memungkinkan pengguna mencari event, membeli tiket digital, melakukan check-in menggunakan QR Code, serta mengelola acara melalui dashboard organizer dan admin.',
            features: [
                'Pencarian dan pembelian tiket event secara digital',
                'Check-in menggunakan QR Code',
                'Dashboard organizer untuk manajemen acara',
                'Dashboard admin untuk pengelolaan sistem',
                'Autentikasi menggunakan JWT',
                'REST API untuk integrasi frontend'
            ],
            tech: ['Laravel', 'REST API', 'PHP', 'MySQL', 'JWT Authentication', 'Postman'],
            links: [
                { label: 'Github', icon: 'fa-brands fa-github', url: 'https://github.com/fahrel-handsome/Vokatif2' }
            ]
        },
        2: {
            title: 'Pemrogaman Web CerdasFin',
            image: 'img/cerdasfin.png',
            description: 'Platform edukasi literasi keuangan berbasis web yang menyediakan modul pembelajaran, pre-test dan post-test, simulasi keuangan, serta sistem gamifikasi untuk meningkatkan pemahaman pengguna mengenai pengelolaan keuangan.',
            features: [
                'Modul pembelajaran literasi keuangan',
                'Pre-test dan post-test untuk evaluasi',
                'Simulasi keuangan interaktif',
                'Sistem gamifikasi untuk motivasi belajar',
                'Export laporan menggunakan DomPDF',
                'Antarmuka responsif dengan Bootstrap'
            ],
            tech: ['Laravel', 'PHP', 'MySQL', 'Blade', 'DomPDF', 'Bootstrap'],
            links: [
                { label: 'Github', icon: 'fa-brands fa-github', url: 'https://github.com/fahrel-handsome/cerdasfin' }
            ]
        },
        3: {
            title: 'Design UI/UX Taskku',
            image: 'img/tassku.png',
            description: 'Prototype aplikasi manajemen tugas untuk membantu mahasiswa mengatur deadline, memantau progres tugas, dan meningkatkan produktivitas melalui antarmuka yang modern dan mudah digunakan.',
            features: [
                'Desain antarmuka modern dan intuitif',
                'Manajemen deadline dan pengingat tugas',
                'Pemantauan progres tugas',
                'Prototyping interaktif di Figma',
                'User research dan usability testing',
                'Design thinking methodology'
            ],
            tech: ['Figma', 'Design Thinking', 'Prototyping', 'Usability Testing'],
            links: [
                { label: 'Prototype', icon: 'fa-brands fa-figma', url: 'https://www.figma.com/proto/dAYUjUK2soaJ9Zfy8WO9al/UAS-UI-UX?node-id=17-3&starting-point-node-id=17%3A2' }
            ]
        },
        4: {
            title: 'Pemrogaman Game Sport Racer',
            image: 'img/game.png',
            description: 'Game balap 3D berbasis Unity yang dilengkapi sistem checkpoint, lap counter, ranking pemain, timer balapan, serta AI lawan untuk memberikan pengalaman bermain yang kompetitif.',
            features: [
                'Sistem checkpoint dan lap counter',
                'Ranking pemain real-time',
                'Timer balapan dengan presisi tinggi',
                'AI lawan untuk tantangan kompetitif',
                'Desain UI game yang interaktif',
                '3D environment dan vehicle modeling'
            ],
            tech: ['Unity', 'C#', '3D Modeling', 'UI Design'],
            links: []
        }
    };

    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalFeatures = document.getElementById('modal-features');
    const modalTech = document.getElementById('modal-tech');
    const modalActions = document.getElementById('modal-actions');

    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project-id');
            const data = projectData[projectId];
            if (!data) return;

            modalImg.src = data.image;
            modalImg.alt = data.title;
            modalTitle.textContent = data.title;
            modalDesc.textContent = data.description;

            modalFeatures.innerHTML = '';
            data.features.forEach(f => {
                const li = document.createElement('li');
                li.textContent = f;
                modalFeatures.appendChild(li);
            });

            modalTech.innerHTML = '';
            data.tech.forEach(t => {
                const span = document.createElement('span');
                span.className = 'tech-badge';
                span.textContent = t;
                modalTech.appendChild(span);
            });

            modalActions.innerHTML = '';
            data.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.className = 'btn btn-primary btn-sm';
                a.innerHTML = `<i class="${link.icon}"></i> ${link.label}`;
                modalActions.appendChild(a);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
})();


// ============================================
// 8. SWIPER — Certification Slider
// ============================================
(function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.certification-swiper', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            0: { spaceBetween: 16 },
            768: { spaceBetween: 30 }
        }
    });
})();


// ============================================
// 9. CERTIFICATE MODAL
// ============================================
(function initCertModal() {
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalClose = document.getElementById('cert-modal-close');
    const certModalOverlay = document.getElementById('cert-modal-overlay');

    document.querySelectorAll('.cert-img').forEach(img => {
        img.addEventListener('click', () => {
            certModalImg.src = img.src;
            certModalImg.alt = img.alt;
            certModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeCertModal() {
        certModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
    if (certModalOverlay) certModalOverlay.addEventListener('click', closeCertModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCertModal();
    });
})();


// ============================================
// 9b. EXPERIENCE MODAL
// ============================================
(function initExpModal() {
    // ─── Experience Detail Data ────────────────────────────
    // To add recap photos:
    //   1. Place your image files in the "img/" folder
    //   2. Add the path to the "images" array below
    // Example: images: ['img/exp1_photo1.jpg', 'img/exp1_photo2.jpg']
    // ───────────────────────────────────────────────────────
    const experienceData = {
        1: {
            title: 'Owner',
            company: 'Sadflixstuff',
            period: '2023 — Present',
            icon: 'fa-solid fa-briefcase',
            description: 'Managing a camera buying and selling business with a focus on customer relations, marketing strategies, inventory management, and direct sales operations.',
            highlights: [
                'Buying and selling second hand cameras',
                'Managing customer relationships and communication',
                'Digital marketing and product photography',
                'Inventory tracking and pricing strategies',
                'Quality checking and product assessment'
            ],
            // ── HOW TO ADD RECAP PHOTOS ──────────────────
            // 1. Put your image files in the "img/" folder
            // 2. Uncomment or add lines below like this:
            //    'img/your_photo_name.jpg',
            // ─────────────────────────────────────────────
            images: [
                'img/kamera1.jpg',
                'img/kamera2.jpg',
            ]
        },
        2: {
            title: 'Popup Market Tenant',
            company: 'Project X Market',
            period: 'MAY 2026',
            icon: 'fa-solid fa-store',
            description: 'Participated in a 3-day popup market event promoting and selling camera products directly to visitors, gaining hands-on experience in direct sales and event-based marketing.',
            highlights: [
                'Promoted camera products at a popup market event',
                'Direct sales and customer interaction',
                'Product display and booth management',
                'Networking with other vendors and visitors'
            ],
            images: [
                'img/recap_day1.jpg',
                'img/recap_day2.jpg',
                'img/recap_day3.jpg',
            ]
        }
    };

    const expModal = document.getElementById('exp-modal');
    const expOverlay = document.getElementById('exp-modal-overlay');
    const expClose = document.getElementById('exp-modal-close');
    const expIcon = document.getElementById('exp-modal-icon');
    const expTitle = document.getElementById('exp-modal-title');
    const expCompany = document.getElementById('exp-modal-company');
    const expPeriod = document.getElementById('exp-modal-period');
    const expDesc = document.getElementById('exp-modal-desc');
    const expHighlights = document.getElementById('exp-modal-highlights');
    const expGallery = document.getElementById('exp-modal-gallery');

    // Open modal
    document.querySelectorAll('.exp-detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const expId = btn.getAttribute('data-exp-id');
            const data = experienceData[expId];
            if (!data) return;

            // Icon
            expIcon.innerHTML = `<i class="${data.icon}"></i>`;

            // Text content
            expTitle.textContent = data.title;
            expCompany.textContent = data.company;
            expPeriod.textContent = data.period;
            expDesc.textContent = data.description;

            // Highlights
            expHighlights.innerHTML = '';
            data.highlights.forEach(h => {
                const li = document.createElement('li');
                li.textContent = h;
                expHighlights.appendChild(li);
            });

            // Gallery
            expGallery.innerHTML = '';
            if (data.images && data.images.length > 0) {
                data.images.forEach(imgSrc => {
                    const div = document.createElement('div');
                    div.className = 'exp-gallery-item';
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = data.title + ' recap photo';
                    img.addEventListener('click', () => {
                        // Open in cert-modal for full view
                        const certModal = document.getElementById('cert-modal');
                        const certModalImg = document.getElementById('cert-modal-img');
                        if (certModal && certModalImg) {
                            certModalImg.src = imgSrc;
                            certModalImg.alt = data.title + ' recap';
                            certModal.classList.add('active');
                        }
                    });
                    div.appendChild(img);
                    expGallery.appendChild(div);
                });
            } else {
                const p = document.createElement('p');
                p.className = 'exp-gallery-empty';
                p.textContent = 'No recap photos added yet.';
                expGallery.appendChild(p);
            }

            expModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeExpModal() {
        expModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (expClose) expClose.addEventListener('click', closeExpModal);
    if (expOverlay) expOverlay.addEventListener('click', closeExpModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeExpModal();
    });
})();


// ============================================
// 10. AOS INITIALIZATION
// ============================================
(function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
        });
    }
})();


// ============================================
// 11. GSAP ANIMATIONS (Safe — no hiding)
// ============================================
(function initGSAP() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Parallax on hero image (scroll-driven, no opacity changes)
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.to('.hero-image-wrapper', {
            y: 50,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });
    }
})();
