importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAqqujNlqmiqlVKXz6WBxfgSXnHP8gIqIk",
    authDomain: "battle-alert.firebaseapp.com",
    projectId: "battle-alert",
    storageBucket: "battle-alert.firebasestorage.app",
    messagingSenderId: "724267211096",
    appId: "1:724267211096:web:8af6a8a63cf0eabb6bed2d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);
    
    const notificationTitle = payload.notification?.title || '🚨 Battle Alert';
    const notificationOptions = {
        body: payload.notification?.body || 'New alert received!',
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        tag: 'battle-alert-' + Date.now(),
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200],
        silent: false,
        renotify: true,
        data: payload.data,
        actions: [
            {
                action: 'open',
                title: 'View Alert'
            },
            {
                action: 'close',
                title: 'Dismiss'
            }
        ]
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                // Check if there's already a window open
                for (const client of clientList) {
                    if (client.url.includes('battle-alert') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event);
});
