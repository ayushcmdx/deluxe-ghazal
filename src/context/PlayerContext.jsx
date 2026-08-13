import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { tracks } from "../data/tracks";

const PlayerContext = createContext(null);

const STORAGE_KEY = "delux-gazhal-player-state";

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById("youtube-iframe-api");

    window.onYouTubeIframeAPIReady = () => resolve(window.YT);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });
}

const savedState = loadSavedState();
const initialTrack = savedState
  ? tracks.find((t) => t.id === savedState.trackId) || tracks[0]
  : tracks[0];
const initialProgress =
  savedState && typeof savedState.progress === "number" ? savedState.progress : 0;
const initialShouldAutoplay = Boolean(savedState?.isPlaying);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialProgress);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [queue, setQueue] = useState([]);

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        height: "0",
        width: "0",
        videoId: currentTrack.videoId,
        playerVars: {
          playsinline: 1,
          start: Math.floor(initialProgress) || undefined,
          autoplay: initialShouldAutoplay ? 1 : 0,
        },
        events: {
          onReady: () => {
            setIsReady(true);
            if (initialProgress > 0) {
              playerRef.current.seekTo(initialProgress, true);
              setProgress(initialProgress);
            }
            if (initialShouldAutoplay) {
              playerRef.current.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(playerRef.current.getDuration());
            } else if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
            if (event.data === YT.PlayerState.ENDED) {
              playNext();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setProgress(playerRef.current.getCurrentTime());
      }
    }, 500);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Persist current track, progress, and play state so playback can resume on refresh.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          trackId: currentTrack.id,
          progress,
          isPlaying,
        })
      );
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, [currentTrack, progress, isPlaying]);

  // Capture the freshest position right before the tab closes/refreshes.
  useEffect(() => {
    function handleBeforeUnload() {
      if (!playerRef.current?.getCurrentTime) return;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            trackId: currentTrack.id,
            progress: playerRef.current.getCurrentTime(),
            isPlaying,
          })
        );
      } catch {
        // ignore storage errors
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentTrack, isPlaying]);

  const playTrack = useCallback((track) => {
    if (!playerRef.current || !isReady) return;
    setCurrentTrack(track);
    setProgress(0);
    playerRef.current.loadVideoById(track.videoId);
  }, [isReady]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying, isReady]);

  const seekTo = useCallback((seconds) => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.seekTo(seconds, true);
    setProgress(seconds);
  }, [isReady]);

  const addToQueue = useCallback((track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const playNext = useCallback(() => {
    setQueue((prevQueue) => {
      if (prevQueue.length > 0) {
        const [nextFromQueue, ...rest] = prevQueue;
        playTrack(nextFromQueue);
        return rest;
      }
      const index = tracks.findIndex((t) => t.id === currentTrack.id);
      const next = tracks[(index + 1) % tracks.length];
      playTrack(next);
      return prevQueue;
    });
  }, [currentTrack, playTrack]);

  const playPrevious = useCallback(() => {
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const previous = tracks[(index - 1 + tracks.length) % tracks.length];
    playTrack(previous);
  }, [currentTrack, playTrack]);

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    isReady,
    queue,
    addToQueue,
    removeFromQueue,
    playTrack,
    togglePlay,
    seekTo,
    playNext,
    playPrevious,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <div ref={containerRef} className="hidden" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}