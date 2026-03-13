// Placeholder Firebase Cloud Messaging service worker.
// This file is required so that the browser can successfully register
// `/firebase-messaging-sw.js` without returning a 404 during development.

self.addEventListener('push', (event) => {
  // No-op default handler to avoid errors if push messages arrive
  // before a full implementation is added.
  // You can customize notification behavior here later.
});

