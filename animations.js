// animations.js
class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initTypewriter();
        this.initParallax();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observer les sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Observer les cartes
        document.querySelectorAll('.competence-card, .langue-card, .projet-card, .sae-card').forEach(card => {
            observer.observe(card);
        });
    }

    initTypewriter() {
        // Animation typewriter pour le titre
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Démarrer après un délai
            setTimeout(typeWriter, 1000);
        }
    }

    initParallax() {
        // Effet parallaxe simple pour l'héro
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-section');
            if (parallax) {
                const rate = scrolled * -0.5;
                parallax.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}


// animations.js - Animations complémentaires
class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initFadeInAnimations();
    }

    initScrollAnimations() {
        // Animation au défilement
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observer les sections et cartes
        document.querySelectorAll('section, .competence-card, .langue-card, .projet-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initFadeInAnimations() {
        // Animation d'apparition progressive
        const elements = document.querySelectorAll('.hero-content, .section-title');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnimations();
});
// Initialiser les animations
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnimations();
});