import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { PlayerProvider } from "./context/PlayerContext";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="playlists/:playlistId" element={<PlaylistDetail />} />
            <Route path="artists" element={<Artists />} />
            <Route path="artists/:artistId" element={<ArtistDetail />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </PlayerProvider>
    </BrowserRouter>
  );
}
