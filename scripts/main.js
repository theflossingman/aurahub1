// Aura OS Main JavaScript
class AuraOS {
    constructor() {
        this.currentUser = null;
        this.users = [
            { id: 'max', name: 'Max', status: 'online', avatar: 'M', gradient: 'avatar-1' },
            { id: 'sarah', name: 'Sarah', status: 'away', avatar: 'S', gradient: 'avatar-2' },
            { id: 'alex', name: 'Alex', status: 'offline', avatar: 'A', gradient: 'avatar-3' }
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.loadUserData();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // User card clicks
        document.querySelectorAll('.user-card[data-user]').forEach(card => {
            card.addEventListener('click', (e) => this.handleUserLogin(e));
        });

        // Add user card
        document.querySelector('.user-card.add-user')?.addEventListener('click', () => {
            this.showAddUserDialog();
        });

        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleActionClick(e));
        });

        // Ripple effect on clickable elements
        document.addEventListener('click', (e) => this.createRipple(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleUserLogin(e) {
        const userCard = e.currentTarget;
        const userId = userCard.dataset.user;
        const user = this.users.find(u => u.id === userId);
        
        if (user) {
            this.loginUser(user);
        }
    }

    loginUser(user) {
        // Add loading animation
        const userCard = document.querySelector(`[data-user="${user.id}"]`);
        userCard.classList.add('loading');
        
        // Simulate login process
        setTimeout(() => {
            this.currentUser = user;
            this.saveUserData();
            this.switchToDashboard();
            userCard.classList.remove('loading');
        }, 800);
    }

    switchToDashboard() {
        const loginScreen = document.getElementById('loginScreen');
        const dashboardScreen = document.getElementById('dashboardScreen');
        
        // Update user info in dashboard
        this.updateDashboardUser();
        
        // Screen transition
        loginScreen.classList.add('hidden');
        setTimeout(() => {
            dashboardScreen.classList.remove('hidden');
            this.initializeDashboardAnimations();
        }, 300);
    }

    updateDashboardUser() {
        if (!this.currentUser) return;
        
        const userAvatar = document.querySelector('.user-avatar-small .avatar-gradient');
        const userInitial = document.querySelector('.user-initial-small');
        const userName = document.querySelector('.current-user');
        
        if (userAvatar) {
            userAvatar.className = `avatar-gradient ${this.currentUser.gradient}`;
        }
        if (userInitial) {
            userInitial.textContent = this.currentUser.avatar;
        }
        if (userName) {
            userName.textContent = this.currentUser.name;
        }
    }

    initializeDashboardAnimations() {
        // Animate dashboard elements
        const elements = document.querySelectorAll('.quick-actions, .family-activity, .action-card, .activity-item');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleActionClick(e) {
        const card = e.currentTarget;
        const action = card.querySelector('h4').textContent.toLowerCase();
        
        // Add ripple effect
        this.createRipple(e);
        
        // Handle different actions
        switch(action) {
            case 'messages':
                this.openMessages();
                break;
            case 'calendar':
                this.openCalendar();
                break;
            case 'photos':
                this.openPhotos();
                break;
            case 'notes':
                this.openNotes();
                break;
        }
    }

    openMessages() {
        this.showNotification('Messages', 'Opening messages...', 'info');
    }

    openCalendar() {
        this.showNotification('Calendar', 'Opening calendar...', 'info');
    }

    openPhotos() {
        this.showNotification('Photos', 'Opening photo gallery...', 'info');
    }

    openNotes() {
        this.showNotification('Notes', 'Opening notes...', 'info');
    }

    showAddUserDialog() {
        const name = prompt('Enter user name:');
        if (name && name.trim()) {
            this.addNewUser(name.trim());
        }
    }

    addNewUser(name) {
        const newUser = {
            id: name.toLowerCase(),
            name: name,
            status: 'online',
            avatar: name.charAt(0).toUpperCase(),
            gradient: `avatar-${(this.users.length + 1)}`
        };
        
        this.users.push(newUser);
        this.renderUserCard(newUser);
        this.showNotification('User Added', `${name} has been added to Aura OS`, 'success');
    }

    renderUserCard(user) {
        const usersGrid = document.querySelector('.users-grid');
        const addUserCard = document.querySelector('.add-user');
        
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.dataset.user = user.id;
        userCard.innerHTML = `
            <div class="user-avatar">
                <div class="avatar-gradient ${user.gradient}"></div>
                <span class="user-initial">${user.avatar}</span>
            </div>
            <h3 class="user-name">${user.name}</h3>
            <p class="user-status">${user.status}</p>
        `;
        
        usersGrid.insertBefore(userCard, addUserCard);
        
        // Add event listener
        userCard.addEventListener('click', (e) => this.handleUserLogin(e));
        
        // Animate in
        setTimeout(() => {
            userCard.style.opacity = '0';
            userCard.style.transform = 'scale(0.8)';
            userCard.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                userCard.style.opacity = '1';
                userCard.style.transform = 'scale(1)';
            }, 50);
        }, 100);
    }

    createRipple(e) {
        const card = e.currentTarget;
        if (!card) return;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createParticles() {
        const background = document.querySelector('.background');
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'liquid-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            background.appendChild(particle);
        }
    }

    initializeAnimations() {
        // Add liquid animations to elements
        document.querySelectorAll('.user-card, .action-card').forEach(card => {
            card.classList.add('liquid-card');
        });
        
        // Add floating animations
        document.querySelectorAll('.orb').forEach((orb, index) => {
            orb.classList.add(`floating-delay-${index + 1}`);
        });
    }

    handleKeyboard(e) {
        // ESC to logout
        if (e.key === 'Escape' && this.currentUser) {
            logout();
        }
        
        // Number keys for quick user selection
        if (!this.currentUser && e.key >= '1' && e.key <= '9') {
            const userIndex = parseInt(e.key) - 1;
            const userCards = document.querySelectorAll('.user-card[data-user]');
            if (userCards[userIndex]) {
                userCards[userIndex].click();
            }
        }
    }

    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">×</button>
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
        }, 3000);
        
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

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('auraOS_currentUser', JSON.stringify(this.currentUser));
        }
    }

    loadUserData() {
        const savedUser = localStorage.getItem('auraOS_currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.switchToDashboard();
            } catch (e) {
                console.error('Error loading user data:', e);
            }
        }
    }
}

// Global logout function
function logout() {
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    
    // Clear current user
    auraOS.currentUser = null;
    localStorage.removeItem('auraOS_currentUser');
    
    // Screen transition
    dashboardScreen.classList.add('hidden');
    setTimeout(() => {
        loginScreen.classList.remove('hidden');
    }, 300);
}

// Initialize Aura OS
const auraOS = new AuraOS();

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 1rem;
        min-width: 300px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .notification-content h4 {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .notification-content p {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0;
    }
    
    .notification-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.25rem;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
    
    .notification-success {
        border-color: rgba(34, 197, 94, 0.3);
        background: rgba(34, 197, 94, 0.1);
    }
    
    .notification-info {
        border-color: rgba(59, 130, 246, 0.3);
        background: rgba(59, 130, 246, 0.1);
    }
    
    .loading {
        opacity: 0.7;
        pointer-events: none;
        transform: scale(0.95);
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
