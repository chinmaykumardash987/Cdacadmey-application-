import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically update service worker on all installed devices & APKs
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        // Immediate update check
        registration.update().catch(() => {});

        // Check for updates when user returns to app
        window.addEventListener('focus', () => {
          registration.update().catch(() => {});
        });

        // Periodic background update check every 3 minutes
        setInterval(() => {
          registration.update().catch(() => {});
        }, 1000 * 60 * 3);
      })
      .catch(err => {
        console.warn('Service worker registration note:', err);
      });

    // When a new service worker takes over, seamlessly reload once so new logo & code take effect
    let isReloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isReloading) {
        isReloading = true;
        console.log('CD ACADEMY updated to newest version on this device.');
        window.location.reload();
      }
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
