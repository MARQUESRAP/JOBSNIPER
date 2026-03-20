"use client";

import { useEffect, useRef, useState } from "react";

export function useTimeOnPage() {
  const startTime = useRef(Date.now());
  const pausedTime = useRef(0);
  const lastPause = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        lastPause.current = Date.now();
      } else if (lastPause.current) {
        pausedTime.current += Date.now() - lastPause.current;
        lastPause.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const interval = setInterval(() => {
      const now = Date.now();
      const total = now - startTime.current - pausedTime.current;
      setElapsed(Math.floor(total / 1000));
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, []);

  return elapsed;
}
