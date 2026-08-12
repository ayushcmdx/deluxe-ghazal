import { Link } from "react-router-dom";
import { artists } from "../data/tracks";

export default function Artists() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 font-display text-4xl text-cream sm:text-5xl">
        Artists
      </h1>
      <p className="mb-10 text-brass">Wo ustad jinki awaaz ne ghazal ko amar kar diya.</p>

      <div className="grid gap-5 sm:grid-cols-2">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/artists/${artist.id}`}
            className="glass group rounded-2xl p-6 transition hover:border-amber/40"
          >
            <h2 className="font-display text-2xl text-cream transition group-hover:text-amber-light sm:text-3xl">
              {artist.name}
            </h2>
            <p className="mt-1 text-xs tracking-wide text-amber uppercase">
              {artist.title}
            </p>
            <p className="mt-3 text-sm text-brass">{artist.bio}</p>
            <p className="mt-4 text-xs text-cream/50">{artist.years}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
