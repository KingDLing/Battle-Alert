// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBVnI6XN0eL6gKelJuVbYejmhlmYSl89RI",
    authDomain: "battle-alert-9db25.firebaseapp.com",
    projectId: "battle-alert-9db25",
    storageBucket: "battle-alert-9db25.firebasestorage.app",
    messagingSenderId: "485179486012",
    appId: "1:485179486012:web:fa2c712e452ad2dff03839"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

console.log('[SW] Firebase Messaging initialized in service worker');

// Set background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || '🚨 Battle Alert';
    const notificationBody = payload.notification?.body || 'New alert received!';
    
    console.log('[SW] Showing notification:', notificationTitle, notificationBody);
    
    const notificationOptions = {
        body: notificationBody,
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        tag: 'battle-alert-' + Date.now(),
        requireInteraction: true,
        data: payload.data || {},
        vibrate: [200, 100, 200]
    };
    
    // Show notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification.tag);
    event.notification.close();
    
    // This opens the app
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            // Check if there's already a window/tab open with the app
            for (const client of clientList) {
                if (client.url.includes('Battle-Alert') && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no app window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow('https://kingdling.github.io/Battle-Alert/');
            }
        })
    );
});

// Optional: Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[SW] Notification closed:', event.notification.tag);
});
