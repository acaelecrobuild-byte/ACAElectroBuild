/**
 * ACA ÉlectroBuild - JavaScript principal
 * Version Premium 2025
 */

(function() {
    'use strict';

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ============================================
    // MENU MOBILE
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================
    // FAQ ACCORDÉON
    // ============================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(button) {
        button.addEventListener('click', function() {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Fermer tous les items
            document.querySelectorAll('.faq-item').forEach(function(item) {
                item.classList.remove('active');
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.setAttribute('aria-expanded', 'false');
                }
            });

            // Ouvrir l'item cliqué s'il n'était pas déjà actif
            if (!isActive) {
                faqItem.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ============================================
    // BOUTON RETOUR EN HAUT
    // ============================================
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        // Afficher/masquer le bouton selon le scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Action du bouton
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // ANIMATIONS AU SCROLL
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .zone-card').forEach(function(el) {
        observer.observe(el);
    });

    // ============================================
    // NAVIGATION ACTIVE AU SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(function(item) {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // COMPTEURS ANIMÉS (STATS)
    // ============================================
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        const suffix = element.textContent.replace(/[0-9]/g, '');

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }

        updateCounter();
    }

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(function(stat) {
                        const text = stat.textContent;
                        const num = parseInt(text);
                        if (!isNaN(num)) {
                            animateCounter(stat, num, 2000);
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ============================================
    // FORMULAIRE DE CONTACT
    // ============================================
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Validation supplémentaire côté client
            const nom = contactForm.querySelector('#nom');
            const telephone = contactForm.querySelector('#telephone');
            const service = contactForm.querySelector('#service');
            const wilaya = contactForm.querySelector('#wilaya');
            const message = contactForm.querySelector('#message');

            let isValid = true;

            // Réinitialiser les erreurs
            contactForm.querySelectorAll('.error-message').forEach(function(el) {
                el.remove();
            });

            // Validation des champs requis
            if (!nom || !nom.value.trim()) {
                showError(nom, 'Veuillez entrer votre nom');
                isValid = false;
            }

            if (!telephone || !telephone.value.trim()) {
                showError(telephone, 'Veuillez entrer votre téléphone');
                isValid = false;
            }

            if (!service || !service.value) {
                showError(service, 'Veuillez sélectionner un service');
                isValid = false;
            }

            if (!wilaya || !wilaya.value) {
                showError(wilaya, 'Veuillez sélectionner une wilaya');
                isValid = false;
            }

            if (!message || !message.value.trim()) {
                showError(message, 'Veuillez décrire votre projet');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    function showError(field, message) {
        if (!field) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #dc2626; font-size: 0.85rem; margin-top: 0.25rem;';
        errorDiv.textContent = message;

        field.parentElement.appendChild(errorDiv);
        field.style.borderColor = '#dc2626';

        field.addEventListener('input', function() {
            field.style.borderColor = '';
            const error = field.parentElement.querySelector('.error-message');
            if (error) error.remove();
        }, { once: true });
    }

    // ============================================
    // PROTECTION EMAIL (Obfuscation)
    // ============================================
    function decodeEmail(encoded) {
        const email = encoded.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
        return email;
    }

    // Décoder les emails encodés
    document.querySelectorAll('[data-email-encoded]').forEach(function(el) {
        const encoded = el.getAttribute('data-email-encoded');
        if (encoded) {
            el.textContent = decodeEmail(encoded);
            el.href = 'mailto:' + decodeEmail(encoded);
        }
    });

    // ============================================
    // PERFORMANCE: LAZY LOADING AMÉLIORÉ
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    console.log('%c ACA ÉlectroBuild ', 'background: #2563eb; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
    console.log('%c Site web développé avec ❤️ pour votre confort et sécurité ', 'color: #2563eb; font-size: 12px;');

})();
