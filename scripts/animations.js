// Aura OS Animations JavaScript
class AuraAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupLiquidAnimations();
        this.setupMorphingBackgrounds();
        this.setupParticleEffects();
        this.setupLiquidLoader();
        this.setupGlowEffects();
        this.setupLiquidText();
    }

    setupLiquidAnimations() {
        // Add liquid animations to interactive elements
        const liquidElements = document.querySelectorAll('.user-card, .action-card, button');
        
        liquidElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => this.addLiquidEffect(e));
            element.addEventListener('mouseleave', (e) => this.removeLiquidEffect(e));
        });
    }

    addLiquidEffect(e) {
        const element = e.currentTarget;
        element.style.transform = 'translateY(-5px) scale(1.02)';
        element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(102, 126, 234, 0.3)';
    }

    removeLiquidEffect(e) {
        const element = e.currentTarget;
        element.style.transform = '';
        element.style.boxShadow = '';
    }

    setupMorphingBackgrounds() {
        // Create morphing gradient backgrounds
        const containers = document.querySelectorAll('.login-container, .dashboard-container');
        
        containers.forEach(container => {
            const morphBg = document.createElement('div');
            morphBg.className = 'morph-bg';
            container.appendChild(morphBg);
        });
    }

    setupParticleEffects() {
        // Enhanced particle system
        const background = document.querySelector('.background');
        if (!background) return;

        // Create different types of particles
        this.createLiquidBubbles(background);
        this.createFloatingOrbs(background);
        this.createLightParticles(background);
    }

    createLiquidBubbles(container) {
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'liquid-bubble';
            bubble.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 70%, transparent 100%);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                bottom: -50px;
                animation: bubbleRise ${10 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(bubble);
        }

        // Add bubble animation
        const bubbleStyle = document.createElement('style');
        bubbleStyle.textContent = `
            @keyframes bubbleRise {
                0% {
                    bottom: -50px;
                    transform: translateX(0) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    bottom: 100vh;
                    transform: translateX(${Math.random() * 200 - 100}px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(bubbleStyle);
    }

    createFloatingOrbs(container) {
        for (let i = 0; i < 5; i++) {
            const orb = document.createElement('div');
            orb.className = 'floating-orb';
            orb.style.cssText = `
                position: absolute;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: radial-gradient(circle, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.1) 50%, transparent 100%);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatOrb ${15 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(orb);
        }

        // Add orb animation
        const orbStyle = document.createElement('style');
        orbStyle.textContent = `
            @keyframes floatOrb {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.3;
                }
                25% {
                    transform: translate(30px, -20px) scale(1.1);
                    opacity: 0.5;
                }
                50% {
                    transform: translate(-20px, 30px) scale(0.9);
                    opacity: 0.4;
                }
                75% {
                    transform: translate(-30px, -10px) scale(1.05);
                    opacity: 0.5;
                }
            }
        `;
        document.head.appendChild(orbStyle);
    }

    createLightParticles(container) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'light-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: lightFloat ${8 + Math.random() * 4}s linear infinite;
                animation-delay: ${Math.random() * 8}s;
            `;
            container.appendChild(particle);
        }

        // Add light particle animation
        const lightStyle = document.createElement('style');
        lightStyle.textContent = `
            @keyframes lightFloat {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(lightStyle);
    }

    setupLiquidLoader() {
        // Create liquid loader for loading states
        const loaderHTML = `
            <div class="liquid-loader-container" style="display: none;">
                <div class="liquid-loader"></div>
                <p class="loading-text">Loading...</p>
            </div>
        `;

        const loaderContainer = document.createElement('div');
        loaderContainer.innerHTML = loaderHTML;
        document.body.appendChild(loaderContainer.firstElementChild);

        // Add loader styles
        const loaderStyle = document.createElement('style');
        loaderStyle.textContent = `
            .liquid-loader-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 10000;
            }
            
            .loading-text {
                margin-top: 1rem;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(loaderStyle);
    }

    setupGlowEffects() {
        // Add glow effects to important elements
        const glowElements = document.querySelectorAll('.logo-icon, .action-icon');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('glow');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('glow');
            });
        });
    }

    setupLiquidText() {
        // Add liquid text effect to titles
        const titles = document.querySelectorAll('.app-title, .dashboard-title');
        
        titles.forEach(title => {
            title.classList.add('liquid-text');
        });
    }

    // Public methods for triggering animations
    triggerLiquidAnimation(element, type = 'ripple') {
        switch(type) {
            case 'ripple':
                this.createRippleEffect(element);
                break;
            case 'pulse':
                this.createPulseEffect(element);
                break;
            case 'glow':
                this.createGlowEffect(element);
                break;
        }
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'liquid-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: liquidRipple 0.6s ease-out;
            pointer-events: none;
        `;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createPulseEffect(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 2000);
    }

    createGlowEffect(element) {
        element.classList.add('glow');
        setTimeout(() => {
            element.classList.remove('glow');
        }, 2000);
    }

    // Background animation control
    startBackgroundAnimation() {
        document.querySelectorAll('.orb').forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
    }

    pauseBackgroundAnimation() {
        document.querySelectorAll('.orb').forEach(orb => {
            orb.style.animationPlayState = 'paused';
        });
    }

    // Liquid morphing effect
    morphElement(element, fromShape, toShape, duration = 1000) {
        element.style.transition = `border-radius ${duration}ms ease-in-out`;
        element.style.borderRadius = fromShape;
        
        setTimeout(() => {
            element.style.borderRadius = toShape;
        }, 50);
    }

    // Liquid wave effect
    createWaveEffect(container) {
        const wave = document.createElement('div');
        wave.className = 'liquid-wave';
        wave.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: linear-gradient(180deg, transparent 0%, rgba(102,126,234,0.1) 50%, rgba(102,126,234,0.2) 100%);
            animation: waveMotion 3s ease-in-out infinite;
        `;

        container.style.position = 'relative';
        container.appendChild(wave);

        // Add wave animation
        const waveStyle = document.createElement('style');
        waveStyle.textContent = `
            @keyframes waveMotion {
                0%, 100% {
                    transform: translateY(0) scaleY(1);
                }
                50% {
                    transform: translateY(-20px) scaleY(1.2);
                }
            }
        `;
        document.head.appendChild(waveStyle);
    }
}

// Initialize animations
const auraAnimations = new AuraAnimations();

// Make animations globally available
window.auraAnimations = auraAnimations;
