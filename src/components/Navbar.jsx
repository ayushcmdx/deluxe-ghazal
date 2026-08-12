import { NavLink } from "react-router-dom";
import Clock from "./Clock";
import { externalLinks } from "../data/links";

const links = [
  { to: "/playlists", label: "Playlists"},
];

function SpotifyIcon({ size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="#1DB954"
      aria-hidden="true"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.719-.66 13.439 1.621.361.181.54.78.301 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function YouTubeMusicIcon({ size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#FF0000" />
      <circle cx="12" cy="12" r="7.2" fill="#FFFFFF" />
      <circle cx="12" cy="12" r="5.7" fill="#FF0000" />
      <path d="M10.2 9.1v5.8l4.9-2.9-4.9-2.9z" fill="#FFFFFF" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-transparent">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="flex shrink-0 items-center gap-2">
            <span className="font-display text-lg text-white sm:text-xl">
              
            </span>
          </NavLink>
          <div className="hidden items-center rounded-xl border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:flex">
            <Clock className="flex" />
          </div>
        </div>

        <ul className="order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-2 sm:w-auto sm:gap-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm whitespace-nowrap backdrop-blur-sm transition ${
                    isActive
                      ? "border-white/40 bg-white/20 text-white"
                      : "border-white/25 bg-white/10 text-white/90 hover:border-white/40 hover:bg-white/15 hover:text-white"
                  }`
                }
              >
                <span className="font-mono text-xs text-white/60">
                  {link.token}
                </span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="order-2 flex shrink-0 items-center gap-2 sm:order-3">
          <a
            href={externalLinks.spotify}
            target="_blank"
            rel="noreferrer"
            className="glass flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/90 transition hover:border-white/40 hover:text-white sm:text-sm"
          >
            <SpotifyIcon size={14} />
            Spotify
          </a>
          <a
            href={externalLinks.ytMusic}
            target="_blank"
            rel="noreferrer"
            className="glass flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/90 transition hover:border-white/40 hover:text-white sm:text-sm"
          >
            <YouTubeMusicIcon size={14} />
            YT Music
          </a>
        </div>
      </div>
    </header>
  );
}