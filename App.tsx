import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Home";
import GamePage from "@/pages/Game";
import LeaderboardPage from "@/pages/Leaderboard";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
