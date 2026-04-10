const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Data persistence functions
const AURA_DATA_FILE = path.join(__dirname, 'aura-data.json');
const DAILY_AURA_DATA_FILE = path.join(__dirname, 'daily-aura-data.json');

function loadAuraData() {
    try {
        if (fs.existsSync(AURA_DATA_FILE)) {
            const data = fs.readFileSync(AURA_DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading aura data:', error);
    }
    return {
        max: 0,
        gigi: 0,
        marco: 0,
        dezi: 0,
        sevi: 0
    };
}

function loadDailyAuraData() {
    try {
        if (fs.existsSync(DAILY_AURA_DATA_FILE)) {
            const data = fs.readFileSync(DAILY_AURA_DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading daily aura data:', error);
    }
    
    const today = new Date().toDateString();
    return {
        max: { 
            dezi: 0, 
            gigi: 0, 
            marco: 0, 
            sevi: 0, 
            date: today
        },
        gigi: { 
            max: 0, 
            dezi: 0, 
            marco: 0, 
            sevi: 0, 
            date: today
        },
        marco: { 
            max: 0, 
            gigi: 0, 
            dezi: 0, 
            sevi: 0, 
            date: today
        },
        dezi: { 
            max: 0, 
            gigi: 0, 
            marco: 0, 
            sevi: 0, 
            date: today
        },
        sevi: { 
            max: 0, 
            gigi: 0, 
            marco: 0, 
            dezi: 0, 
            date: today
        }
    };
}

function saveAuraData() {
    try {
        fs.writeFileSync(AURA_DATA_FILE, JSON.stringify(auraData, null, 2));
        fs.writeFileSync(DAILY_AURA_DATA_FILE, JSON.stringify(dailyAuraData, null, 2));
        console.log('Aura data saved successfully');
    } catch (error) {
        console.error('Error saving aura data:', error);
    }
}

// Load data on startup
let auraData = loadAuraData();
let dailyAuraData = loadDailyAuraData();

// Daily reset function
function performDailyReset() {
    const today = new Date().toDateString();
    let resetPerformed = false;
    
    // Check if we need to reset for any user
    Object.keys(dailyAuraData).forEach(userId => {
        if (dailyAuraData[userId].date !== today) {
            // Reset this user's daily limits
            Object.keys(dailyAuraData[userId]).forEach(key => {
                if (key !== 'date') {
                    dailyAuraData[userId][key] = 0;
                }
            });
            dailyAuraData[userId].date = today;
            resetPerformed = true;
        }
    });
    
    if (resetPerformed) {
        saveAuraData();
        console.log(`[${new Date().toISOString()}] Daily aura limits reset for all users`);
    }
}

// Schedule daily reset at 4 AM
function scheduleDailyReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(4, 0, 0, 0); // Set to 4 AM tomorrow
    
    const msUntil4AM = tomorrow.getTime() - now.getTime();
    
    console.log(`[${new Date().toISOString()}] Scheduled daily reset for ${tomorrow.toISOString()}`);
    
    setTimeout(() => {
        performDailyReset();
        // Schedule next day's reset
        scheduleDailyReset();
    }, msUntil4AM);
}

// Perform initial reset check and schedule daily resets
performDailyReset();
scheduleDailyReset();

// REST API endpoints
app.use(express.json());
app.use(express.static('.'));

// Get aura data
app.get('/api/aura', (req, res) => {
    res.json({ auraData, dailyAuraData });
});

// Update aura (fallback REST API)
app.post('/api/aura', (req, res) => {
    const { person, action, currentUser } = req.body;
    
    // Same validation logic as WebSocket
    if (!person || !action || !currentUser) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    
    const today = new Date().toDateString();
    if (dailyAuraData[currentUser].date !== today) {
        Object.keys(dailyAuraData[currentUser]).forEach(key => {
            if (key !== 'date') {
                dailyAuraData[currentUser][key] = 0;
            }
        });
        dailyAuraData[currentUser].date = today;
    }
    
    const incrementAmount = 25;
    const currentGivenToPerson = dailyAuraData[currentUser][person] || 0;
    const DAILY_POSITIVE_LIMIT = 500;
    const DAILY_NEGATIVE_LIMIT = -500;
    
    if (action === 'increment') {
        if (currentGivenToPerson + incrementAmount > DAILY_POSITIVE_LIMIT) {
            return res.status(400).json({ 
                error: `You've reached your daily limit of ${DAILY_POSITIVE_LIMIT} aura for ${person.charAt(0).toUpperCase() + person.slice(1)}!` 
            });
        }
        auraData[person] += incrementAmount;
        dailyAuraData[currentUser][person] = currentGivenToPerson + incrementAmount;
    } else if (action === 'decrement') {
        if (currentGivenToPerson - incrementAmount < DAILY_NEGATIVE_LIMIT) {
            return res.status(400).json({ 
                error: `You've reached your daily negative limit of ${DAILY_NEGATIVE_LIMIT} aura for ${person.charAt(0).toUpperCase() + person.slice(1)}!` 
            });
        }
        auraData[person] -= incrementAmount;
        dailyAuraData[currentUser][person] = currentGivenToPerson - incrementAmount;
    }
    
    
    res.json({ success: true, auraData });
});

// Admin API endpoints
app.post('/api/aura/admin', (req, res) => {
    const { userId, auraValue, adminUser } = req.body;
    
    // Verify admin access
    if (adminUser !== 'max') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Validate user exists
    if (!auraData.hasOwnProperty(userId)) {
        return res.status(400).json({ error: 'User not found' });
    }
    
    // Set aura value (no limits for admin)
    auraData[userId] = auraValue;
    
    console.log(`Admin ${adminUser} set ${userId} aura to ${auraValue}`);
    res.json({ success: true, auraData });
});

app.post('/api/aura/admin/reset', (req, res) => {
    const { adminUser } = req.body;
    
    // Verify admin access
    if (adminUser !== 'max') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Reset all aura to 0
    Object.keys(auraData).forEach(userId => {
        auraData[userId] = 0;
    });
    
    // Reset daily limits as well
    Object.keys(dailyAuraData).forEach(userId => {
        Object.keys(dailyAuraData[userId]).forEach(key => {
            if (key !== 'date') {
                dailyAuraData[userId][key] = 0;
            }
        });
    });
    
    // Save data after changes
    saveAuraData();
    
    console.log(`Admin ${adminUser} reset all aura to 0`);
    res.json({ success: true, auraData, dailyAuraData });
});

// Test endpoint for daily reset
app.post('/api/test/daily-reset', (req, res) => {
    console.log(`[${new Date().toISOString()}] Manual daily reset test triggered`);
    
    // Store current state for comparison
    const beforeState = JSON.parse(JSON.stringify(dailyAuraData));
    
    // Force reset by setting yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    Object.keys(dailyAuraData).forEach(userId => {
        dailyAuraData[userId].date = yesterdayString;
        // Set some test data
        Object.keys(dailyAuraData[userId]).forEach(key => {
            if (key !== 'date') {
                dailyAuraData[userId][key] = Math.floor(Math.random() * 200) + 50; // Random test data
            }
        });
    });
    
    console.log('Before reset:', JSON.stringify(beforeState, null, 2));
    
    // Perform the reset
    performDailyReset();
    
    console.log('After reset:', JSON.stringify(dailyAuraData, null, 2));
    
    res.json({ 
        success: true, 
        message: 'Daily reset test completed',
        before: beforeState,
        after: dailyAuraData
    });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
    console.log(`Aura OS Backend Server running on http://${HOST}:${PORT}`);
    console.log(`Access from other devices on your network using your computer's IP address`);
});
