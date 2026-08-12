import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    seekTo,
    playNext,
    playPrevious,
  } = usePlayer();

  const percent = duration ? (progress / duration) * 100 : 0;

  function handleSeek(event) {
    if (!duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seekTo(Math.max(0, Math.min(duration, ratio * duration)));
  }

  return (
    <div className="glass-strong mx-auto flex w-full max-w-sm items-center gap-3 rounded-2xl p-2 pr-4 shadow-2xl shadow-black/40">
      {currentTrack.videoId && (
        <img
          src={`https://img.youtube.com/vi/${currentTrack.videoId}/mqdefault.jpg`}
          alt={currentTrack.title}
          className="h-12 w-12 shrink-0 rounded-xl object-cover"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate font-display text-sm leading-none text-cream">
          {currentTrack.title}
        </p>
        <p className="truncate text-[11px] text-brass">
          {currentTrack.artist}
        </p>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="w-7 font-mono text-[9px] text-brass">
            {formatTime(progress)}
          </span>
          <button
            type="button"
            onClick={handleSeek}
            aria-label="Seek"
            className="group relative h-1 flex-1 cursor-pointer rounded-full bg-void/60"
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-amber transition-[width]"
              style={{ width: `${percent}%` }}
            />
            <span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-amber-light opacity-0 shadow group-hover:opacity-100"
              style={{ left: `${percent}%` }}
            />
          </button>
          <span className="w-7 font-mono text-[9px] text-brass">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={playPrevious}
          aria-label="Previous track"
          className="rounded-full p-1.5 text-cream/80 transition hover:text-amber-light"
        >
          <SkipBack size={15} fill="currentColor" />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="rounded-full bg-amber p-2 text-void shadow-lg shadow-amber/30 transition hover:bg-amber-light active:scale-95"
        >
          {isPlaying ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" className="ml-0.5" />
          )}
        </button>
        <button
          type="button"
          onClick={playNext}
          aria-label="Next track"
          className="rounded-full p-1.5 text-cream/80 transition hover:text-amber-light"
        >
          <SkipForward size={15} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}