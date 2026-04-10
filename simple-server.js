// Simple Node.js Server for Aura OS (No dependencies required)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Create server
const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Handle CORS headers for PWA
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Service-Worker-Allowed', '/');
    
    // Get file path
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';
    
    // Handle API routes
    if (req.url.startsWith('/api/')) {
        handleAPI(req, res);
        return;
    }
    
    // Read and serve file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found, try serving index.html for SPA
                fs.readFile('./index.html', (error, content) => {
                    if (error) {
                        res.writeHead(500);
                        res.end('Server Error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000'
            });
            res.end(content, 'utf-8');
        }
    });
});

// Handle API routes
function handleAPI(req, res) {
    res.setHeader('Content-Type', 'application/json');
    
    switch(req.url) {
        case '/api/users':
            const users = [
                { id: 'max', name: 'Max', status: 'online', avatar: 'M', gradient: 'avatar-1' },
                { id: 'sarah', name: 'Sarah', status: 'away', avatar: 'S', gradient: 'avatar-2' },
                { id: 'alex', name: 'Alex', status: 'offline', avatar: 'A', gradient: 'avatar-3' }
            ];
            res.writeHead(200);
            res.end(JSON.stringify(users));
            break;
            
        case '/api/activity':
            const activities = [
                { user: 'Sarah', action: 'added photos to vacation album', time: '2 hours ago', avatar: 'avatar-2' },
                { user: 'Alex', action: 'created a new note', time: '5 hours ago', avatar: 'avatar-3' },
                { user: 'Max', action: 'updated calendar event', time: '1 day ago', avatar: 'avatar-1' }
            ];
            res.writeHead(200);
            res.end(JSON.stringify(activities));
            break;
            
        case '/health':
            res.writeHead(200);
            res.end(JSON.stringify({ 
                status: 'ok', 
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }));
            break;
            
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
}

// Start server
server.listen(PORT, () => {
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
    console.log(`  - No dependencies required`);
    console.log(`\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});

module.exports = server;
