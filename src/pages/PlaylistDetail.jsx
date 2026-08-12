import { Link, Navigate, useParams } from "react-router-dom";
import { playlists, tracks } from "../data/tracks";
import TrackRow from "../components/TrackRow";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) {
    return <Navigate to="/playlists" replace />;
  }

  const playlistTracks = playlist.trackIds
    .map((id) => tracks.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/playlists"
        className="mb-6 inline-block text-sm text-brass transition hover:text-amber"
      >
        ← Sab playlists
      </Link>

      <h1 className="font-display text-4xl text-cream sm:text-5xl">
        {playlist.title}
      </h1>
      <p className="mt-2 mb-8 text-brass">{playlist.description}</p>

      <div className="flex flex-col gap-2">
        {playlistTracks.map((track) => (
          <TrackRow key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
