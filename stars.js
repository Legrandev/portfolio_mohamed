class Starfield {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.scrollY = 0;
        this.isActive = false;
        this.init();
    }

    init() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            pointer-events: none;
            display: none;
        `;

        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.resize();
        this.createStars();
        
        // Vérifier le thème actuel
        this.checkTheme();
        
        // Écouter les changements de thème
        const observer = new MutationObserver(() => this.checkTheme());
        observer.observe(document.documentElement, { attributes: true });
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
    }

    checkTheme() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkMode && !this.isActive) {
            this.activate();
        } else if (!isDarkMode && this.isActive) {
            this.deactivate();
        }
    }

    activate() {
        this.isActive = true;
        this.canvas.style.display = 'block';
        this.canvas.style.background = '#000000';
        this.animate();
    }

    deactivate() {
        this.isActive = false;
        this.canvas.style.display = 'none';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createStars();
    }

    createStars() {
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 1000);
        this.stars = [];

        for (let i = 0; i < starCount; i++) {
            const type = Math.random();
            let size, brightness;
            
            if (type < 0.6) {
                size = Math.random() * 0.8 + 0.2;
                brightness = Math.random() * 0.4 + 0.2;
            } else if (type < 0.9) {
                size = Math.random() * 1 + 0.5;
                brightness = Math.random() * 0.6 + 0.3;
            } else {
                size = Math.random() * 1.5 + 0.8;
                brightness = Math.random() * 0.8 + 0.5;
            }

            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: size,
                brightness: brightness,
                originalBrightness: brightness,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                twinkleSpeed: Math.random() * 0.005 + 0.002,
            });
        }
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            star.brightness += star.twinkleSpeed * star.pulseDirection;
            
            if (star.brightness > star.originalBrightness + 0.3 || 
                star.brightness < star.originalBrightness - 0.3) {
                star.pulseDirection *= -1;
            }

            const parallaxY = this.scrollY * 0.1;
            const currentY = (star.y + parallaxY) % this.canvas.height;

            this.ctx.beginPath();
            this.ctx.arc(star.x, currentY, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Starfield();

});
