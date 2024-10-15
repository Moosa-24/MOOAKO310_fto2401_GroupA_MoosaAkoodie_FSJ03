// app/components/ServiceWorker.js
"use client"; // This component is a Client Component

import { useEffect } from "react";

/**
 * ServiceWorker component that registers a service worker for the application.
 * This component uses the useEffect hook to check for service worker support
 * in the browser and registers the service worker when the window loads.
 *
 * @returns {null} This component does not render any visible UI elements.
 */
export default function ServiceWorker() {
  useEffect(() => {
    // Check if the service worker is supported by the browser
    if ("serviceWorker" in navigator) {
      // Register the service worker when the window loads
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js") // Ensure this path points to your service worker
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null; // This component does not render anything
}
