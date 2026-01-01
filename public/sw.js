// Service Worker for Pill Reminder PWA

const CACHE_NAME = 'pill-reminder-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Time to take your pills! 💊',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'pill-reminder',
    requireInteraction: true,
    actions: [
      { action: 'take', title: '✅ Took it!' },
      { action: 'snooze', title: '⏰ Snooze 10min' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('💊 Pill Reminder', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'take') {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  } else if (event.action === 'snooze') {
    // Schedule another notification in 10 minutes
    setTimeout(() => {
      self.registration.showNotification('💊 Pill Reminder - Snoozed', {
        body: 'Hey! You snoozed 10 minutes ago. Take your pills now! 💕',
        icon: '/icon-192.svg',
        badge: '/icon-192.svg',
        vibrate: [200, 100, 200],
        tag: 'pill-reminder-snooze',
        requireInteraction: true
      });
    }, 10 * 60 * 1000); // 10 minutes
  } else {
    // Default click - open app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Background sync for when coming back online
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
});

// Periodic background sync (for scheduled notifications)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-pill-reminders') {
    event.waitUntil(checkAndShowReminders());
  }
});

async function checkAndShowReminders() {
  // Get stored reminder times from IndexedDB or check with the main app
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  // This would check against stored times and show notification if match
  console.log('Checking reminders at', currentTime);
}
