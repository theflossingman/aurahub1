// Aura OS Node.js Server
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            manifestSrc: ["'self'"],
            workerSrc: ["'self'"]
        }
    }
}));

app.use(compression());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// PWA specific headers
app.use((req, res, next) => {
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve manifest
app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Serve service worker
app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// API routes for future functionality
app.get('/api/users', (req, res) => {
    const users = [
        { id: 'max', name: 'Max', status: 'online', avatar: 'M', gradient: 'avatar-1' },
        { id: 'sarah', name: 'Sarah', status: 'away', avatar: 'S', gradient: 'avatar-2' },
        { id: 'alex', name: 'Alex', status: 'offline', avatar: 'A', gradient: 'avatar-3' }
    ];
    res.json(users);
});

app.get('/api/activity', (req, res) => {
    const activities = [
        { user: 'Sarah', action: 'added photos to vacation album', time: '2 hours ago', avatar: 'avatar-2' },
        { user: 'Alex', action: 'created a new note', time: '5 hours ago', avatar: 'avatar-3' },
        { user: 'Max', action: 'updated calendar event', time: '1 day ago', avatar: 'avatar-1' }
    ];
    res.json(activities);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n`);
    console.log(`  Aura OS is running!`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Network: http://localhost:${PORT}`);
    console.log(`  Press Ctrl+C to stop`);
    console.log(`\n`);
    console.log(`  Features:`);
    console.log(`  - PWA with offline support`);
    console.log(`  - Multi-user family dashboard`);
    console.log(`  - Liquid glass animations`);
    console.log(`  - Responsive design`);
    console.log(`\n`);
});

module.exports = app;
