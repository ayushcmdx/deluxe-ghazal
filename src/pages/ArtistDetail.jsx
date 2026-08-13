import { Link, Navigate, useParams } from "react-router-dom";
import { artists, tracks } from "../data/tracks";
import TrackRow from "../components/TrackRow";

export default function ArtistDetail() {
  const { artistId } = useParams();
  const artist = artists.find((a) => a.id === artistId);

  if (!artist) {
    return <Navigate to="/artists" replace />;
  }

  const artistTracks = artist.trackIds
    .map((id) => tracks.find((t) => t.id === id))
    .filter(Boolean);

  const otherArtists = artists.filter((a) => a.id !== artist.id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/artists"
        className="mb-6 inline-block text-sm text-brass transition hover:text-amber"
      >
        ← Sab artists
      </Link>

      <h1 className="font-display text-4xl text-cream sm:text-5xl">
        {artist.name}
      </h1>
      <p className="mt-1 text-sm tracking-wide text-amber uppercase">
        {artist.title} · {artist.years}
      </p>
      <p className="mt-4 mb-8 text-brass">{artist.bio}</p>

      <div className="flex flex-col gap-2">
        {artistTracks.map((track) => (
          <TrackRow key={track.id} track={track} />
        ))}
      </div>

      {otherArtists.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl text-cream sm:text-2xl">
            More Like This
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {otherArtists.map((other) => {
              const sampleTrack = tracks.find((t) => t.id === other.trackIds[0]);
              return (
                <Link
                  key={other.id}
                  to={`/artists/${other.id}`}
                  className="glass group rounded-xl p-4 transition hover:border-amber/40"
                >
                  <p className="font-display text-lg text-cream transition group-hover:text-amber-light">
                    {other.name}
                  </p>
                  <p className="mt-1 text-xs tracking-wide text-amber uppercase">
                    {other.title}
                  </p>
                  {sampleTrack && (
                    <p className="mt-2 truncate text-xs text-brass">
                      {sampleTrack.title}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}