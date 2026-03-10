importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDi7Adni15nsyeKejv-KgvHxlXTdp_eZZ4",
  authDomain: "chat-60009.firebaseapp.com",
  databaseURL: "https://chat-60009-default-rtdb.firebaseio.com",
  projectId: "chat-60009",
  storageBucket: "chat-60009.firebasestorage.app",
  messagingSenderId: "830655265752",
  appId: "1:830655265752:web:133cca04624244642d50ad"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  let title = data.title || 'নতুন মেসেজ';
  let body = data.body || '';
  const type = data.type || 'message';

  if (type === 'image') {
    body = '📷 একটি ছবি পাঠিয়েছে';
  } else if (type === 'voice') {
    body = '🎤 একটি ভয়েস মেসেজ পাঠিয়েছে';
  } else if (type === 'online') {
    title = '🟢 ' + (data.name || '') + ' অনলাইন হয়েছে';
    body = '';
  }

  const icon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💬</text></svg>';

  self.registration.showNotification(title, {
    body: body,
    icon: icon,
    badge: icon,
    data: { url: self.location.origin + '/' },
    tag: 'chat-notification-' + Date.now()
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
