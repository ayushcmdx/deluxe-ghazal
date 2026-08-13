import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PlayerBar from "./PlayerBar";

export default function Layout() {
  return (
    <div className="grain vignette relative isolate min-h-screen bg-void">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/images/Ghazal-bg.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-void/15 via-void/35 to-void/70" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1 px-4 pb-28 pt-10 sm:px-6">
          <Outlet />
        </main>

        <footer className="fixed inset-x-0 bottom-4 z-20 flex justify-center px-4">
          <PlayerBar />
        </footer>
      </div>
    </div>
  );
}