// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// USE YOUR NEW CONFIG - MUST MATCH INDEX.HTML
firebase.initializeApp({
    apiKey: "AIzaSyBVnI6XN0eL6gKelJuVbYejmhlmYSl89RI",
    authDomain: "battle-alert-9db25.firebaseapp.com",
    projectId: "battle-alert-9db25",
    storageBucket: "battle-alert-9db25.firebasestorage.app",
    messagingSenderId: "485179486012",
    appId: "1:485179486012:web:fa2c712e452ad2dff03839"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message:', payload);
    
    const notificationTitle = payload.notification?.title || '🚨 Battle Alert';
    const notificationOptions = {
        body: payload.notification?.body || 'New alert received!',
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        tag: 'battle-alert-' + Date.now(),
        requireInteraction: true,
        data: payload.data || {}
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window open
                for (const client of clientList) {
                    if (client.url.includes('battle') && 'focus' in client) {
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
