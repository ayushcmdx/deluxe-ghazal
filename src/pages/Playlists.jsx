import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { playlists, tracks } from "../data/tracks";
import TrackRow from "../components/TrackRow";

export default function Playlists() {
  const [selectedMood, setSelectedMood] = useState(null);

  const HIDDEN_MOODS = ["Judaai"];

  const moods = useMemo(() => {
    const set = new Set();
    tracks.forEach((track) => (track.moods || []).forEach((m) => set.add(m)));
    return Array.from(set).filter((m) => !HIDDEN_MOODS.includes(m));
  }, []);

  const moodTracks = useMemo(() => {
    if (!selectedMood) return [];
    return tracks.filter((track) => (track.moods || []).includes(selectedMood));
  }, [selectedMood]);

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
      <p className="mb-6 text-white/70">
        Har mood ke liye ek mehfil — chuno aur baitho.
      </p>

      {moods.length > 0 && (
        <div className="mb-10">
          <p className="mb-3 text-xs tracking-[0.2em] text-white/50 uppercase">
            Mood se browse karo
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMood(null)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                selectedMood === null
                  ? "bg-amber text-void"
                  : "glass text-white/80 hover:text-white"
              }`}
            >
              Sabhi Playlists
            </button>
            {moods.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  selectedMood === mood
                    ? "bg-amber text-void"
                    : "glass text-white/80 hover:text-white"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedMood ? (
        <div className="flex flex-col gap-2">
          {moodTracks.length > 0 ? (
            moodTracks.map((track) => <TrackRow key={track.id} track={track} />)
          ) : (
            <p className="text-sm text-white/60">Is mood ki koi ghazal nahi mili.</p>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
}