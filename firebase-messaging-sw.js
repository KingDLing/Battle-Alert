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
    
    const notificationTitle = payload.notification.title || 'Battle Alert';
    const notificationOptions = {
        body: payload.notification.body || 'New alert',
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1077/1077976.png'
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
