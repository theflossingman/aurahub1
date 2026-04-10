// Aura OS Service Worker
const CACHE_NAME = 'aura-os-v1.0.0';
const STATIC_CACHE = 'aura-os-static-v1';
const DYNAMIC_CACHE = 'aura-os-dynamic-v1';

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/animations.css',
    '/scripts/main.js',
    '/scripts/animations.js',
    '/scripts/pwa-install.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Aura OS Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Aura OS Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (url.origin === location.origin) {
        // Same origin requests - serve from cache
        event.respondWith(handleSameOriginRequest(request));
    } else {
        // Cross origin requests - network first, cache fallback
        event.respondWith(handleCrossOriginRequest(request));
    }
});

// Handle same origin requests
async function handleSameOriginRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request, { cacheName: STATIC_CACHE });
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If not in cache, try network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Network error, serving offline page');
        
        // Return offline fallback for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
        }
        
        // Return error for other requests
        return new Response('Offline', { status: 503 });
    }
}

// Handle cross origin requests (fonts, APIs, etc.)
async function handleCrossOriginRequest(request) {
    try {
        // Network first for cross origin
        const networkResponse = await fetch(request);
        
        // Cache font responses
        if (request.url.includes('fonts.googleapis.com') && networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Cross origin network error, trying cache');
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-user-data') {
        event.waitUntil(syncUserData());
    }
});

// Sync user data when back online
async function syncUserData() {
    try {
        // Get any offline user data from IndexedDB
        const offlineData = await getOfflineUserData();
        
        if (offlineData.length > 0) {
            // Sync with server (placeholder for actual sync logic)
            console.log('Syncing user data:', offlineData);
            
            // Clear offline data after successful sync
            await clearOfflineUserData();
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received');
    
    const options = {
        body: event.data?.text() || 'New notification from Aura OS',
        icon: '/assets/icon-192.png',
        badge: '/assets/icon-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open Aura OS',
                icon: '/assets/icon-96.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icon-96.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Aura OS', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification.data);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// IndexedDB helpers for offline storage
async function getOfflineUserData() {
    // Placeholder for IndexedDB implementation
    return [];
}

async function clearOfflineUserData() {
    // Placeholder for IndexedDB implementation
    return true;
}

// Cache management
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data === 'updateCache') {
        event.waitUntil(updateCache());
    }
});

// Update cache manually
async function updateCache() {
    try {
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(STATIC_ASSETS);
        console.log('Cache updated successfully');
    } catch (error) {
        console.error('Cache update failed:', error);
    }
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
    const start = performance.now();
    
    event.respondWith(
        (async () => {
            try {
                const response = await fetch(event.request);
                const duration = performance.now() - start;
                
                if (duration > 1000) {
                    console.warn(`Slow request: ${event.request.url} took ${duration}ms`);
                }
                
                return response;
            } catch (error) {
                const duration = performance.now() - start;
                console.error(`Request failed: ${event.request.url} after ${duration}ms`, error);
                throw error;
            }
        })()
    );
});
