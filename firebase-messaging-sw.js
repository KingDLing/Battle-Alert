// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBVnI6XN0eL6gKelJuVbYejmhlmYSl89RI",
    authDomain: "battle-alert-9db25.firebasestorage.app",
    projectId: "battle-alert-9db25",
    storageBucket: "battle-alert-9db25.firebasestorage.app",
    messagingSenderId: "485179486012",
    appId: "1:485179486012:web:fa2c712e452ad2dff03839"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// IMPORTANT: Log for debugging
console.log('[SW] Firebase Messaging initialized');

// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || '🚨 Battle Alert';
    const notificationOptions = {
        body: payload.notification?.body || 'New alert received!',
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        tag: 'battle-alert-' + Date.now(),
        requireInteraction: true,
        data: payload.data || {},
        actions: [
            {
                action: 'open',
                title: 'Open App'
            }
        ]
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification);
    event.notification.close();
    
    // This looks for open windows and focuses one, or opens a new one
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes('/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
