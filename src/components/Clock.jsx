import { useEffect, useState } from "react";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(date) {
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function Clock({ className = "" }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`${className} items-center gap-2 text-xs text-white/90 sm:text-sm`}>
      <span className="font-mono text-white">{formatTime(now)}</span>
      <span className="text-white/50">·</span>
      <span>{formatDate(now)}</span>
    </div>
  );
}