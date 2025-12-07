import React, { useState, useEffect } from "react";
import { searchAnime, getTopAnime, getSeasonalAnime } from "./services/api";
import AnimeCard from "./components/AnimeCard";
import SearchBar from "./components/SearchBar";
import AnimeDetail from "./components/AnimeDetail";
import Navbar from "./components/Navbar";
import MangaSection from "./components/MangaSection";
import MangaDetail from "./components/MangaDetail";
import CharactersSection from "./components/CharacterSection";
import CharacterDetail from "./components/CharacterDetail"; // ⬅️ pastikan file ini ada

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);
  const [selectedMangaId, setSelectedMangaId] = useState(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null); // ⬅️ character
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 'top' | 'seasonal' | 'search' = halaman Anime
  // 'manga' | 'characters' | 'people' | 'random' = halaman lain
  const [activeView, setActiveView] = useState("top");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeView === "top") {
      loadTopAnime();
    } else if (activeView === "seasonal") {
      loadSeasonalAnime();
    }
  }, [activeView]);

  const loadTopAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopAnime();
      setAnimeList(data.data || []);
    } catch (error) {
      console.error("Error loading top anime:", error);
      setError("Failed to load top anime. Please try again later.");
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonalAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSeasonalAnime();
      setAnimeList(data.data || []);
    } catch (error) {
      console.error("Error loading seasonal anime:", error);
      setError("Failed to load seasonal anime. Please try again later.");
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setActiveView("search");
    setLoading(true);
    setError(null);
    try {
      const data = await searchAnime(query);
      setAnimeList(data.data || []);
      if (!data.data || data.data.length === 0) {
        setError(`No anime found for "${query}"`);
      }
    } catch (error) {
      console.error("Error searching anime:", error);
      setError("Failed to search anime. Please try again.");
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimeClick = (id) => {
    setSelectedAnimeId(id);
  };

  const handleCloseAnimeDetail = () => {
    setSelectedAnimeId(null);
  };

  // Manga
  const handleMangaClick = (id) => {
    setSelectedMangaId(id);
  };

  const handleCloseMangaDetail = () => {
    setSelectedMangaId(null);
  };

  // Character
  const handleCharacterClick = (id) => {
    setSelectedCharacterId(id);
  };

  const handleCloseCharacterDetail = () => {
    setSelectedCharacterId(null);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setSearchQuery("");
    setError(null);
    // tutup semua modal saat pindah halaman
    setSelectedAnimeId(null);
    setSelectedMangaId(null);
    setSelectedCharacterId(null);
  };

  const handleRetry = () => {
    if (activeView === "top") {
      loadTopAnime();
    } else if (activeView === "seasonal") {
      loadSeasonalAnime();
    } else if (activeView === "search" && searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const isAnimeView =
    activeView === "top" ||
    activeView === "seasonal" ||
    activeView === "search";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[theme(--color-dark)] via-[theme(--color-dark-light)] to-[theme(--color-dark)]">
      <Navbar activeView={activeView} onViewChange={handleViewChange} />

      <div className="container-custom py-8">
        {/* ========== ANIME VIEW ========== */}
        {isAnimeView && (
          <>
            {/* Search Bar */}
            <div className="mb-8 animate-fade-in">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Header Section */}
            <div className="mb-6 animate-slide-up">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl">
                  {activeView === "search" && "🔍"}
                  {activeView === "top" && "⭐"}
                  {activeView === "seasonal" && "📅"}
                </div>
                <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] bg-clip-text text-transparent">
                  {activeView === "search" && `Search: "${searchQuery}"`}
                  {activeView === "top" && "Top Anime"}
                  {activeView === "seasonal" && "This Season"}
                </h2>
              </div>

              {!error && !loading && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-block w-2 h-2 bg-[theme(--color-accent)] rounded-full animate-pulse shadow-lg shadow-[theme(--color-accent)]/50" />
                  <span className="text-[theme(--color-text-secondary)] font-medium">
                    <span className="text-white font-bold">
                      {animeList.length}
                    </span>{" "}
                    anime found
                  </span>
                </div>
              )}
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                <div className="relative mb-8">
                  <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-[theme(--color-primary)]" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-4xl">🎌</div>
                  </div>
                </div>
                <p className="text-[theme(--color-text-secondary)] text-xl font-semibold">
                  Loading awesome anime...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
                <div className="text-8xl mb-6">😔</div>
                <h3 className="text-3xl font-black text-[theme(--color-text-primary)] mb-4">
                  Oops! Something went wrong
                </h3>
                <p className="text-[theme(--color-text-secondary)] mb-8 text-center max-w-md text-lg">
                  {error}
                </p>
                <button
                  onClick={handleRetry}
                  className="px-10 py-4 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
                >
                  <span className="text-2xl">🔄</span>
                  <span>Try Again</span>
                </button>
              </div>
            ) : animeList.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-3xl font-black text-[theme(--color-text-primary)] mb-4">
                  No Anime Found
                </h3>
                <p className="text-[theme(--color-text-secondary)] text-center max-w-md text-lg">
                  Try searching with different keywords or browse top anime
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 animate-scale-in">
                {animeList.map((anime) => (
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    onClick={handleAnimeClick}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ========== MANGA VIEW ========== */}
        {activeView === "manga" && (
          <MangaSection onMangaClick={handleMangaClick} />
        )}

        {/* ========== CHARACTERS VIEW ========== */}
        {activeView === "characters" && (
          <CharactersSection onCharacterClick={handleCharacterClick} />
        )}

        {/* ========== LAINNYA (COMING SOON) ========== */}
        {activeView === "people" && (
          <div className="flex items-center justify-center min-h-[400px] text-[theme(--color-text-secondary)]">
            People section is coming soon 👀
          </div>
        )}

        {activeView === "random" && (
          <div className="flex items-center justify-center min-h-[400px] text-[theme(--color-text-secondary)]">
            Random section is coming soon 🎲
          </div>
        )}
      </div>

      {/* Anime Detail Modal */}
      {isAnimeView && selectedAnimeId && (
        <AnimeDetail
          animeId={selectedAnimeId}
          onClose={handleCloseAnimeDetail}
        />
      )}

      {/* Manga Detail Modal */}
      {activeView === "manga" && selectedMangaId && (
        <MangaDetail
          mangaId={selectedMangaId}
          onClose={handleCloseMangaDetail}
        />
      )}

      {/* Character Detail Modal */}
      {activeView === "characters" && selectedCharacterId && (
        <CharacterDetail
          characterId={selectedCharacterId}
          onClose={handleCloseCharacterDetail}
        />
      )}
    </div>
  );
}

export default App;
