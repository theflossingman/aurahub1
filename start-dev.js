// Aura OS Development Server Starter
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Installing dependencies...');
    const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });
    
    npmInstall.on('close', (code) => {
        if (code === 0) {
            console.log('Dependencies installed successfully!');
            startServer();
        } else {
            console.error('Failed to install dependencies');
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('Starting Aura OS development server...');
    
    // Start the server
    const server = spawn('node', ['server.js'], { stdio: 'inherit' });
    
    server.on('close', (code) => {
        console.log(`Server exited with code ${code}`);
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
        console.log('\nShutting down server...');
        server.kill('SIGINT');
        process.exit(0);
    });
}
