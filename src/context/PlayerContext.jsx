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

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

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
        },
        events: {
          onReady: () => setIsReady(true),
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

  const playNext = useCallback(() => {
    const index = tracks.findIndex((t) => t.id === currentTrack.id);
    const next = tracks[(index + 1) % tracks.length];
    playTrack(next);
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
