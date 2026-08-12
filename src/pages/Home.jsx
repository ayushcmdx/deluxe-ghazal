import { Link } from "react-router-dom";
import { tracks, playlists } from "../data/tracks";
import TrackRow from "../components/TrackRow";
import QuoteCard from "../components/QuoteCard";

export default function Home() {
  const featured = playlists[0];
  const featuredTracks = featured.trackIds
    .map((id) => tracks.find((t) => t.id === id))
    .filter(Boolean);

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
          Kursi pe baitho, mehfil jamao — har baal-kataai ke saath ek ghazal.
        </p>
      </div>

      <QuoteCard />

      <section className="w-full text-left">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-cream sm:text-3xl">
            {featured.title}
          </h2>
          <Link
            to="/playlists"
            className="text-sm text-amber transition hover:text-amber-light"
          >
            Sab dekho →
          </Link>
        </div>
        <p className="mb-4 text-sm text-brass">{featured.description}</p>
        <div className="flex flex-col gap-2">
          {featuredTracks.map((track) => (
            <TrackRow key={track.id} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
}
