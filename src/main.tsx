import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically update service worker on all installed devices & APKs
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        // Periodically check for updates on installed devices
        registration.update().catch(() => {});
        setInterval(() => {
          registration.update().catch(() => {});
        }, 1000 * 60 * 30); // check every 30 mins
      })
      .catch(err => {
        console.warn('Service worker registration note:', err);
      });

    // When a new service worker controls the page, inform the app
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('App updated to the newest version.');
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
