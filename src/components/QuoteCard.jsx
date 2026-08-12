import { useEffect, useState } from "react";
import { quotes } from "../data/tracks";

export default function QuoteCard() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((current) => (current + 1) % quotes.length);
        setVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const quote = quotes[index];

  return (
    <div className="glass mx-auto w-full max-w-2xl rounded-2xl px-6 py-5 text-center">
      <p
        className={`font-display text-lg italic text-cream transition-opacity duration-400 sm:text-xl ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        &ldquo;{quote.text}&rdquo;
      </p>
      <p
        className={`mt-2 text-sm text-amber transition-opacity duration-400 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        — {quote.author}
      </p>
    </div>
  );
}
