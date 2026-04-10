// PWA Install Prompt Handler
class PWAInstall {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.createInstallButton();
        this.setupInstallEvents();
        this.checkInstallStatus();
    }

    setupInstallPrompt() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show the install button
            this.showInstallButton();
            
            console.log('Install prompt ready');
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            // Hide the install button
            this.hideInstallButton();
            
            // Clear the deferred prompt
            this.deferredPrompt = null;
            
            // Show success notification
            this.showInstallSuccess();
            
            console.log('Aura OS installed successfully');
        });
    }

    createInstallButton() {
        // Create install button
        this.installButton = document.createElement('button');
        this.installButton.className = 'install-btn';
        this.installButton.innerHTML = `
            <span class="install-icon">Install</span>
            <span class="install-text">Install Aura OS</span>
        `;
        
        // Add styles
        this.installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            z-index: 1000;
            display: none;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        // Add hover effect
        this.installButton.addEventListener('mouseenter', () => {
            this.installButton.style.transform = 'translateY(-2px)';
            this.installButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        });
        
        this.installButton.addEventListener('mouseleave', () => {
            this.installButton.style.transform = 'translateY(0)';
            this.installButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        });
        
        // Add click handler
        this.installButton.addEventListener('click', () => {
            this.promptInstall();
        });
        
        // Add to page
        document.body.appendChild(this.installButton);
    }

    setupInstallEvents() {
        // Add keyboard shortcut for install (Ctrl+Shift+I)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                if (this.deferredPrompt) {
                    this.promptInstall();
                }
            }
        });

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.hideInstallButton();
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`User response to install prompt: ${outcome}`);
            
            // Clear the deferred prompt
            this.deferredPrompt = null;
            
            if (outcome === 'accepted') {
                // User accepted the install prompt
                this.showInstallProgress();
            } else {
                // User dismissed the install prompt
                this.showInstallDismissed();
            }
            
        } catch (error) {
            console.error('Error during install prompt:', error);
            this.showInstallError();
        }
    }

    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'flex';
            this.installButton.style.animation = 'slideInUp 0.5s ease-out';
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.animation = 'slideOutDown 0.5s ease-out';
            setTimeout(() => {
                this.installButton.style.display = 'none';
            }, 500);
        }
    }

    showInstallSuccess() {
        this.showNotification('Installation Successful!', 'Aura OS is now installed on your device', 'success');
    }

    showInstallProgress() {
        this.showNotification('Installing...', 'Installing Aura OS on your device', 'info');
    }

    showInstallDismissed() {
        this.showNotification('Installation Cancelled', 'You can install Aura OS anytime from the menu', 'info');
    }

    showInstallError() {
        this.showNotification('Installation Failed', 'Please try again or contact support', 'error');
    }

    showNotification(title, message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `install-notification install-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">×</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 16px;
            min-width: 300px;
            z-index: 1001;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 4000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    checkInstallStatus() {
        // Check if running as PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInWebAppiOS = (window.navigator.standalone === true);
        const isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);
        
        if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
            console.log('Running as installed PWA');
            this.hideInstallButton();
        } else {
            console.log('Running in browser');
            // Show install button after delay
            setTimeout(() => {
                if (this.deferredPrompt) {
                    this.showInstallButton();
                }
            }, 3000);
        }
    }

    // Method to manually trigger install (for development)
    manualInstall() {
        if (this.deferredPrompt) {
            this.promptInstall();
        } else {
            console.log('Install prompt not available. Try refreshing the page.');
        }
    }
}

// Add notification styles
const notificationStyles = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    .install-notification-success {
        border-color: rgba(34, 197, 94, 0.3);
        background: rgba(34, 197, 94, 0.1);
    }
    
    .install-notification-error {
        border-color: rgba(239, 68, 68, 0.3);
        background: rgba(239, 68, 68, 0.1);
    }
    
    .install-notification-info {
        border-color: rgba(59, 130, 246, 0.3);
        background: rgba(59, 130, 246, 0.1);
    }
    
    .notification-content h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: white;
    }
    
    .notification-content p {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
    }
    
    .notification-close:hover {
        color: white;
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize PWA Install
const pwaInstall = new PWAInstall();

// Make it globally available
window.pwaInstall = pwaInstall;
