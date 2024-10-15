// public/sw.js

/**
 * Service Worker installation event.
 * This event is triggered when the service worker is being installed.
 * It can be used to perform setup tasks, such as pre-caching assets.
 * 
 * @param {InstallEvent} event - The install event.
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
});

/**
 * Service Worker activation event.
 * This event is triggered when the service worker is being activated.
 * It can be used to clean up old caches or perform tasks that require the
 * service worker to be active.
 * 
 * @param {ActivateEvent} event - The activate event.
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
});

// You can add caching logic here for offline support if needed
