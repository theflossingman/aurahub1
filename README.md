# Aura OS - Family Dashboard

A beautiful, modern Progressive Web App (PWA) inspired by Umbrel OS, designed for families with a GenZ aesthetic featuring liquid glass smooth animations.

## Features

- **Multi-User Support**: Each family member gets their own account and personalized experience
- **Real-Time Aura Tracking**: Give/take aura points with per-user daily limits and cross-device synchronization
- **Glassmorphism Design**: Modern liquid glass aesthetic with smooth animations
- **PWA Capabilities**: Installable on any device with offline support
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Liquid Animations**: Smooth, fluid animations throughout the interface
- **Cross-Device Sync**: Manual refresh button to sync data across all devices
- **Daily Limits**: Per-user aura limits (+500/-500) that reset daily
- **Beautiful Notifications**: In-app notifications with smooth animations

## Installation

### As a PWA
1. Open the app in your browser
2. Click the install button (or use Ctrl+Shift+I)
3. Follow the installation prompts
4. Aura OS will be available on your device like a native app

### Manual Setup
1. Clone or download the project
2. Serve the files using a web server (like `python -m http.server` or `npx serve`)
3. Open the app in your browser

## Technology Stack

- **HTML5**: Modern semantic markup
- **CSS3**: Advanced animations and glassmorphism effects
- **Vanilla JavaScript**: No dependencies, pure JS implementation
- **PWA Standards**: Service worker, manifest, offline support
- **Responsive Design**: Mobile-first approach

## File Structure

```
auraos/
|-- index.html              # Main HTML file
|-- manifest.json           # PWA manifest
|-- sw.js                   # Service worker
|-- styles/
|   |-- main.css           # Main styles and glassmorphism
|   |-- animations.css     # Liquid animations
|-- scripts/
|   |-- main.js            # Core functionality
|   |-- animations.js      # Animation system
|   |-- pwa-install.js     # PWA installation
|-- assets/
|   |-- favicon.svg        # App icon
|   |-- icon-*.png         # PWA icons
|   |-- screenshot-*.png   # Screenshots
|-- README.md              # This file
```

## User Guide

### Getting Started
1. Open Aura OS in your browser
2. Select your user profile from the login screen
3. Click "Add User" to create new family member accounts
4. Navigate through the dashboard using the quick actions

### Features
- **User Profiles**: Each family member has their own avatar and status
- **Dashboard**: Personalized home screen with quick actions
- **Activity Feed**: See what family members are up to
- **Quick Actions**: Fast access to common features

### Keyboard Shortcuts
- `ESC`: Logout from dashboard
- `1-9`: Quick user selection on login screen
- `Ctrl+Shift+I`: Manual install prompt

## Customization

### Adding New Users
Users can be added through the "Add User" button on the login screen. Each user gets:
- Custom avatar with gradient background
- Personal name and status
- Individual dashboard experience

### Theming
The app uses CSS variables for easy theming:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    /* ... more variables */
}
```

### Animations
All animations are hardware-accelerated and can be customized in `animations.css`. The system includes:
- Liquid ripple effects
- Morphing backgrounds
- Floating particles
- Smooth transitions

## Development

### Local Development
1. Serve the files locally:
```bash
python -m http.server 8000
# or
npx serve .
```

2. Open `http://localhost:8000` in your browser

### PWA Testing
- Use Chrome DevTools Application panel
- Test offline functionality
- Verify installability
- Check responsive design

## Browser Support

- **Chrome/Edge**: Full support with all PWA features
- **Firefox**: Good support, some PWA features limited
- **Safari**: Basic support, PWA install available on iOS 16.4+
- **Mobile**: Optimized for modern mobile browsers

## Performance

- **Optimized Animations**: Hardware-accelerated CSS transforms
- **Efficient Caching**: Service worker with smart caching strategies
- **Minimal Dependencies**: Pure JavaScript implementation
- **Responsive Images**: Optimized for different screen sizes

## Privacy & Security

- **Local Storage**: User data stored locally on device
- **No Tracking**: No analytics or tracking scripts
- **Offline First**: Works completely offline
- **Secure Context**: Requires HTTPS for PWA features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Production Deployment

### Docker Deployment

1. **Build and run with Docker Compose:**
```bash
docker-compose up -d
```

2. **Access the application:**
- Local: http://localhost:3002
- Network: http://YOUR_IP:3002

### GitHub Actions & Portainer

1. **Push to GitHub:**
```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

2. **GitHub Actions** will automatically:
- Build Docker image
- Push to GitHub Container Registry (`ghcr.io`)
- Support multi-architecture (amd64, arm64)

3. **Deploy to Portainer:**
- Open Portainer dashboard
- Go to Stacks > Add stack
- Use `portainer-stack.yml` file
- Update image: `ghcr.io/YOUR_USERNAME/aura-os:latest`
- Deploy

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | production | Application environment |
| PORT | 3002 | Server port |

### Health Monitoring

The container includes health checks that:
- Test API endpoints every 30 seconds
- Auto-restart on failures
- Provide monitoring data

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Future Features

- [ ] More app integrations (weather, news, etc.)
- [ ] Custom themes and wallpapers
- [ ] Voice commands and notifications
- [ ] Family shared calendar and notes
- [ ] Photo sharing and gallery
- [ ] Message system between family members
- [ ] Real-time WebSocket synchronization (optional)

## Support

For issues, questions, or feature requests, please open an issue on the repository.

---

**Aura OS** - Bringing families together with beautiful technology.
