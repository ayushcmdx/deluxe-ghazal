import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { playlists, tracks } from "../data/tracks";

export default function Playlists() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <h1 className="mb-2 font-display text-4xl text-white sm:text-5xl">
        Playlists
      </h1>
      <p className="mb-10 text-white/70">
        Har mood ke liye ek mehfil — chuno aur baitho.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {playlists.map((playlist) => {
          const count = playlist.trackIds.length;
          const firstTrack = tracks.find((t) => t.id === playlist.trackIds[0]);

          return (
            <Link
              key={playlist.id}
              to={`/playlists/${playlist.id}`}
              className="glass group rounded-2xl p-6 transition hover:border-white/40"
            >
              <h2 className="font-display text-2xl text-white transition group-hover:text-white/80 sm:text-3xl">
                {playlist.title}
              </h2>
              <p className="mt-2 text-sm text-white/70">{playlist.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                <span>{count} ghazalein</span>
                {firstTrack && <span>ft. {firstTrack.artist}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}