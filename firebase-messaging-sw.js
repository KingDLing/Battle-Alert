// Use compat versions for service workers
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || '🚨 Battle Alert';
    const notificationBody = payload.notification?.body || 'New alert received!';
    
    const notificationOptions = {
        body: notificationBody,
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        tag: 'battle-alert-' + Date.now(),
        requireInteraction: true,
        data: payload.data || {},
        vibrate: [200, 100, 200]
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes('Battle-Alert') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('https://kingdling.github.io/Battle-Alert/');
            }
        })
    );
});
