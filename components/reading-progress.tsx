"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const element = document.documentElement;
      const max = element.scrollHeight - element.clientHeight;
      const next = max <= 0 ? 100 : Math.min(100, Math.round((element.scrollTop / max) * 100));
      setValue(next);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-1 bg-border"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label="Reading progress"
    >
      <div className="h-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}
