import { Pause, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function TrackRow({ track }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const isCurrent = currentTrack.id === track.id;

  function handleClick() {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition ${
        isCurrent ? "glass-amber" : "glass hover:border-cream/25"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isCurrent ? "bg-amber text-void" : "bg-void/60 text-amber"
        }`}
      >
        {isCurrent && isPlaying ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-base text-cream sm:text-lg">
          {track.title}
        </span>
        <span className="block truncate text-xs text-brass sm:text-sm">
          {track.artist} · {track.album} · {track.year}
        </span>
      </span>
    </button>
  );
}
