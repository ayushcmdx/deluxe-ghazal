# Delux Gazhal

Salon-themed ghazal player — React + Vite + Tailwind CSS v4 + YouTube IFrame API.

## Setup

```bash
npm install
npm run dev
```

## Add your background image

Drop your salon/ghazal-themed image at:

```
public/images/salon-bg.jpg
```

The layout picks it up automatically — no code changes needed.

## Structure

- `src/data/tracks.js` — tracks, playlists, artists, quotes (edit this to add more)
- `src/context/PlayerContext.jsx` — global YouTube player state (hidden iframe, custom controls)
- `src/components/PlayerBar.jsx` — the floating player bar
- `src/components/QuoteCard.jsx` — rotating barber quotes
- `src/pages/` — Home, Playlists, Artists, About + detail pages

## Adding a track

Add an entry to `tracks` in `src/data/tracks.js` with a real YouTube `videoId`,
then reference its `id` in any playlist's or artist's `trackIds`.

## Build

```bash
npm run build
```

Output goes to `dist/`.
