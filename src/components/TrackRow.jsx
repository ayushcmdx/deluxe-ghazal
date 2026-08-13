import { ListPlus, Pause, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function TrackRow({ track }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = usePlayer();
  const isCurrent = currentTrack.id === track.id;

  function handleClick() {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      className={`flex w-full cursor-pointer items-center gap-4 rounded-xl px-4 py-3 text-left transition ${
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

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          addToQueue(track);
        }}
        aria-label="Add to queue"
        title="Add to queue"
        className="shrink-0 rounded-full p-2 text-cream/60 transition hover:bg-white/10 hover:text-amber-light"
      >
        <ListPlus size={18} />
      </button>
    </div>
  );
}