import { useEffect, useState } from "react";
import {
  ChevronDown,
  ListMusic,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
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
    queue,
    removeFromQueue,
  } = usePlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // null | "queue" | "lyrics"
  const [shareMessage, setShareMessage] = useState("");

  const percent = duration ? (progress / duration) * 100 : 0;

  function handleSeek(event) {
    if (!duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seekTo(Math.max(0, Math.min(duration, ratio * duration)));
  }

  function stopBubble(event) {
    event.stopPropagation();
  }

  function togglePanel(panel) {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  async function handleShare() {
    const url = currentTrack.videoId
      ? `https://www.youtube.com/watch?v=${currentTrack.videoId}`
      : window.location.href;
    const shareData = {
      title: `${currentTrack.title} — ${currentTrack.artist}`,
      text: "Sun ye ghazal Delux Gazhal pe:",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share sheet, nothing to do
      }
      return;
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied!");
        setTimeout(() => setShareMessage(""), 2000);
      } catch {
        // clipboard not available
      }
    }
  }

  useEffect(() => {
    if (!isExpanded) return;

    function handleKeyDown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      } else if (event.code === "ArrowRight") {
        playNext();
      } else if (event.code === "ArrowLeft") {
        playPrevious();
      } else if (event.code === "Escape") {
        setIsExpanded(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, togglePlay, playNext, playPrevious]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setIsExpanded(true);
        }}
        aria-label="Open full player"
        className="glass-strong mx-auto flex w-full max-w-sm cursor-pointer items-center gap-3 rounded-2xl p-2 pr-4 shadow-2xl shadow-black/40"
      >
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
              onClick={(event) => {
                stopBubble(event);
                handleSeek(event);
              }}
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
            onClick={(event) => {
              stopBubble(event);
              playPrevious();
            }}
            aria-label="Previous track"
            className="rounded-full p-1.5 text-cream/80 transition hover:text-amber-light"
          >
            <SkipBack size={15} fill="currentColor" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              stopBubble(event);
              togglePlay();
            }}
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
            onClick={(event) => {
              stopBubble(event);
              playNext();
            }}
            aria-label="Next track"
            className="rounded-full p-1.5 text-cream/80 transition hover:text-amber-light"
          >
            <SkipForward size={15} fill="currentColor" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isExpanded ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div
          className="absolute inset-0 bg-void/80 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />

        <div
          className={`absolute inset-x-0 bottom-0 flex h-full flex-col bg-void transition-transform duration-300 ease-out ${
            isExpanded ? "translate-y-0" : "translate-y-full"
          }`}
          style={{
            backgroundImage: "url('/images/Ghazal-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex h-full flex-col overflow-hidden bg-void/80 px-6 pb-8 pt-6 backdrop-blur-md">
            <div className="flex shrink-0 items-center justify-between">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                aria-label="Close full player"
                className="rounded-full p-2 text-cream/80 transition hover:text-amber-light"
              >
                <ChevronDown size={26} />
              </button>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-brass">
                Now Playing
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share this ghazal"
                  title="Share"
                  className="rounded-full p-2 text-cream/80 transition hover:text-amber-light"
                >
                  <Share2 size={20} />
                </button>
                {shareMessage && (
                  <span className="absolute top-full right-0 mt-1 whitespace-nowrap rounded-lg bg-void px-2 py-1 text-[10px] text-amber-light shadow">
                    {shareMessage}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto py-4">
              {currentTrack.videoId && (
                <img
                  src={`https://img.youtube.com/vi/${currentTrack.videoId}/maxresdefault.jpg`}
                  alt={currentTrack.title}
                  className="glass-strong aspect-square w-full max-w-xs shrink-0 rounded-3xl object-cover shadow-2xl shadow-black/50"
                />
              )}

              <div className="flex w-full max-w-xs shrink-0 flex-col items-center gap-1 text-center">
                <p className="truncate font-display text-2xl text-cream">
                  {currentTrack.title}
                </p>
                <p className="truncate text-sm text-brass">
                  {currentTrack.artist}
                </p>
              </div>

              <div className="w-full max-w-xs shrink-0">
                <button
                  type="button"
                  onClick={handleSeek}
                  aria-label="Seek"
                  className="group relative h-1.5 w-full cursor-pointer rounded-full bg-cream/20"
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-amber transition-[width]"
                    style={{ width: `${percent}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-amber-light opacity-0 shadow group-hover:opacity-100"
                    style={{ left: `${percent}%` }}
                  />
                </button>
                <div className="mt-2 flex justify-between font-mono text-[11px] text-brass">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-8">
                <button
                  type="button"
                  onClick={playPrevious}
                  aria-label="Previous track"
                  className="rounded-full p-2 text-cream/80 transition hover:text-amber-light"
                >
                  <SkipBack size={28} fill="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="rounded-full bg-amber p-4 text-void shadow-lg shadow-amber/30 transition hover:bg-amber-light active:scale-95"
                >
                  {isPlaying ? (
                    <Pause size={28} fill="currentColor" />
                  ) : (
                    <Play size={28} fill="currentColor" className="ml-1" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={playNext}
                  aria-label="Next track"
                  className="rounded-full p-2 text-cream/80 transition hover:text-amber-light"
                >
                  <SkipForward size={28} fill="currentColor" />
                </button>
              </div>

              <div className="flex w-full max-w-xs shrink-0 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => togglePanel("queue")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs transition ${
                    activePanel === "queue"
                      ? "bg-amber text-void"
                      : "glass text-cream/80 hover:text-amber-light"
                  }`}
                >
                  <ListMusic size={14} />
                  Up Next{queue.length > 0 ? ` (${queue.length})` : ""}
                </button>
                <button
                  type="button"
                  onClick={() => togglePanel("lyrics")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs transition ${
                    activePanel === "lyrics"
                      ? "bg-amber text-void"
                      : "glass text-cream/80 hover:text-amber-light"
                  }`}
                >
                  Lyrics
                </button>
              </div>

              {activePanel === "queue" && (
                <div className="w-full max-w-xs shrink-0 text-left">
                  {queue.length === 0 ? (
                    <p className="glass rounded-xl px-4 py-3 text-center text-xs text-brass">
                      Queue khaali hai — kisi track pe{" "}
                      <span className="text-amber-light">+</span> dabao.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {queue.map((track, index) => (
                        <div
                          key={`${track.id}-${index}`}
                          className="glass flex items-center gap-3 rounded-xl px-3 py-2"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-cream">
                              {track.title}
                            </span>
                            <span className="block truncate text-[11px] text-brass">
                              {track.artist}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromQueue(index)}
                            aria-label="Remove from queue"
                            className="shrink-0 rounded-full p-1 text-cream/50 transition hover:text-amber-light"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activePanel === "lyrics" && (
                <div className="w-full max-w-xs shrink-0 text-left">
                  <div className="glass max-h-48 overflow-y-auto rounded-xl px-4 py-3 text-sm whitespace-pre-line text-cream/80">
                    {currentTrack.lyrics
                      ? currentTrack.lyrics
                      : "Lyrics abhi available nahi hain."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}