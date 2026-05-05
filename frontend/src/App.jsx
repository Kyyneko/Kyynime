import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnimePage from './pages/AnimePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import MangaPage from './pages/MangaPage';
import MangaDetailPage from './pages/MangaDetailPage';
import CharacterPage from './pages/CharacterPage';
import CharacterDetailPage from './pages/CharacterDetailPage';
import PeoplePage from './pages/PeoplePage';
import PeopleDetailPage from './pages/PeopleDetailPage';
import RandomPage from './pages/RandomPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[theme(--color-dark)] via-[theme(--color-dark-light)] to-[theme(--color-dark)]">
      <Navbar />

      <div className="container-custom py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime" element={<AnimePage mode="top" />} />
          <Route path="/anime/seasonal" element={<AnimePage mode="seasonal" />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/manga" element={<MangaPage />} />
          <Route path="/manga/:id" element={<MangaDetailPage />} />
          <Route path="/characters" element={<CharacterPage />} />
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/:id" element={<PeopleDetailPage />} />
          <Route path="/random" element={<RandomPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="border-t border-[theme(--color-border)] bg-[theme(--color-dark-light)]/50 mt-10">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎌</span>
              <span className="font-black text-lg bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] bg-clip-text text-transparent">Kyynime</span>
            </div>
            <p className="text-[theme(--color-text-muted)] text-sm text-center">
              Made with ❤️ by <a href="https://github.com/Kyyneko" target="_blank" rel="noopener noreferrer" className="text-[theme(--color-primary)] hover:underline font-bold">Kyyneko</a> • Powered by <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer" className="text-[theme(--color-accent)] hover:underline font-bold">Jikan API</a>
            </p>
            <p className="text-[theme(--color-text-muted)] text-xs">© 2026 Kyynime</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
