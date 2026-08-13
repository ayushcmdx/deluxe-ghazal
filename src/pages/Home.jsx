import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { tracks } from "../data/tracks";
import TrackRow from "../components/TrackRow";
import QuoteCard from "../components/QuoteCard";

export default function Home() {
  const [query, setQuery] = useState("");

  const topGhazals = useMemo(() => tracks.filter((t) => t.featured), []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );
  }, [query]);

  const isSearching = searchResults !== null;
  const listTracks = isSearching ? searchResults : topGhazals;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 text-center">
      <div className="mt-8 sm:mt-16">
        <p className="mb-3 font-mono text-xs tracking-[0.3em] text-brass uppercase">
          Est. Mehfil
        </p>
        <h1 className="text-shadow-marquee font-display text-6xl leading-[0.95] text-cream sm:text-8xl">
          रात
          <br />
          ये ग़ज़ल.
        </h1>
        <p className="mt-5 text-base text-cream/70 sm:text-lg">
          Kursi pe baitho, mehfil jamao — har pal ke saath ek ghazal.
        </p>
      </div>

      <QuoteCard />

      <section className="w-full text-left">
        <div className="glass-strong mb-6 flex items-center gap-2 rounded-2xl px-4 py-3">
          <Search size={18} className="shrink-0 text-brass" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ghazal, singer ya album khojo..."
            aria-label="Search ghazals"
            className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="shrink-0 rounded-full p-1 text-cream/60 transition hover:text-amber-light"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-cream sm:text-3xl">
            {isSearching ? "Search Results" : "Top 4 Ghazal"}
          </h2>
          {!isSearching && (
            <Link
              to="/playlists"
              className="text-sm text-amber transition hover:text-amber-light"
            >
              Sab dekho →
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {listTracks.length > 0 ? (
            listTracks.map((track) => <TrackRow key={track.id} track={track} />)
          ) : (
            <p className="text-sm text-brass">Koi ghazal nahi mili.</p>
          )}
        </div>
      </section>
    </div>
  );
}