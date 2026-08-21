"use client";

import { useEffect } from "react";

export function ScrollManager() {
  useEffect(() => {
    // Prevent the browser from automatically restoring the last scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force an instant scroll to top on mount
    window.scrollTo(0, 0);

    // Timeout fallback to ensure any smooth scroll libraries (like Lenis) also reset
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" as any });
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return null;
}