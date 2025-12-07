import React, { useState, useEffect, useRef } from "react";
import {
  getCharacterFull,
  getCharacterAnime,
  getCharacterManga,
  getCharacterVoices,
} from "../services/api";

const CharacterDetail = ({ characterId, onClose }) => {
  const [character, setCharacter] = useState(null);
  const [animeRoles, setAnimeRoles] = useState([]);
  const [mangaRoles, setMangaRoles] = useState([]);
  const [voices, setVoices] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoadingRef = useRef(false);
  const loadedIdRef = useRef(null);

  useEffect(() => {
    setActiveTab("overview");
    if (isLoadingRef.current || loadedIdRef.current === characterId) return;
    loadCharacterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  const loadCharacterData = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        getCharacterFull(characterId),
        getCharacterAnime(characterId),
        getCharacterManga(characterId),
        getCharacterVoices(characterId),
      ]);

      const [fullRes, animeRes, mangaRes, voicesRes] = results;

      if (fullRes.status === "fulfilled" && fullRes.value?.data) {
        setCharacter(fullRes.value.data);
        loadedIdRef.current = characterId;
      } else {
        throw new Error("Failed to load character details");
      }

      setAnimeRoles(
        animeRes.status === "fulfilled" && animeRes.value?.data
          ? animeRes.value.data.slice(0, 20)
          : []
      );

      setMangaRoles(
        mangaRes.status === "fulfilled" && mangaRes.value?.data
          ? mangaRes.value.data.slice(0, 20)
          : []
      );

      setVoices(
        voicesRes.status === "fulfilled" && voicesRes.value?.data
          ? voicesRes.value.data.slice(0, 20)
          : []
      );
    } catch (err) {
      console.error("Error loading character data:", err);
      setError(err.message || "Failed to load character details");
      setCharacter(null);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-b-4 border-[theme(--color-primary)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="text-2xl sm:text-3xl">👤</div>
            </div>
          </div>
          <p className="mt-6 text-[theme(--color-text-secondary)] text-base sm:text-lg font-medium text-center">
            Loading character details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        <div className="bg-[theme(--color-dark-card)] rounded-2xl p-6 sm:p-8 max-w-md mx-4 text-center border-2 border-[theme(--color-border)]">
          <div className="text-5xl sm:text-6xl mb-4">😔</div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Failed to Load Character
          </h3>
          <p className="text-[theme(--color-text-secondary)] mb-6 text-sm sm:text-base">
            {error || "Unable to load character details. Please try again later."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={loadCharacterData}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              🔄 Retry
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[theme(--color-dark-light)] text-white font-bold rounded-xl hover:bg-[theme(--color-border)] transform hover:scale-105 transition-all duration-300 border border-[theme(--color-border)] text-sm sm:text-base"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const image =
    character.images?.jpg?.image_url || character.images?.webp?.image_url;

  const nicknameText =
    character.nicknames && character.nicknames.length > 0
      ? character.nicknames.join(", ")
      : "—";

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto animate-fade-in">
      <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-5xl lg:max-w-6xl mx-auto bg-[theme(--color-dark-card)] rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Header */}
          <div
            className="relative bg-cover bg-center"
            style={{
              backgroundImage:
                typeof window !== "undefined" && window.innerWidth >= 640 && image
                  ? `linear-gradient(rgba(0,0,0,0.85), rgba(10,14,39,0.98)), url(${image})`
                  : "none",
              backgroundColor: "rgb(21,27,61)",
            }}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {image && (
                  <img
                    src={image}
                    alt={character.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-cover rounded-2xl shadow-2xl border-4 border-[theme(--color-primary)]/50 hover:border-[theme(--color-primary)] transition-all mx-auto lg:mx-0"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-1 sm:mb-2 drop-shadow-lg break-words">
                    {character.name}
                  </h1>
                  {character.name_kanji && (
                    <p className="text-sm sm:text-base lg:text-lg text-[theme(--color-text-secondary)] mb-1 sm:mb-2 break-words">
                      {character.name_kanji}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-[theme(--color-text-muted)] mb-3 sm:mb-4 break-words">
                    Nicknames: {nicknameText}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm">
                    <span className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-black shadow-xl flex items-center gap-1 border-2 border-[theme(--color-primary-light)]">
                      <span>⭐</span>
                      <span>
                        {character.favorites
                          ? `${character.favorites.toLocaleString()} favorites`
                          : "No favorites data"}
                      </span>
                    </span>
                    {animeRoles.length > 0 && (
                      <span className="bg-[theme(--color-primary)]/20 border border-[theme(--color-primary)] px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-[theme(--color-primary)] font-bold shadow-lg">
                        {animeRoles.length} Anime roles
                      </span>
                    )}
                    {mangaRoles.length > 0 && (
                      <span className="bg-[theme(--color-accent)]/20 border border-[theme(--color-accent)] px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-[theme(--color-accent)] font-bold shadow-lg">
                        {mangaRoles.length} Manga roles
                      </span>
                    )}
                    {voices.length > 0 && (
                      <span className="bg-[theme(--color-accent-orange)]/20 border border-[theme(--color-accent-orange)] px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-[theme(--color-accent-orange)] font-bold shadow-lg">
                        {voices.length} Voice actors
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-[theme(--color-border)] px-2 sm:px-4 lg:px-8 overflow-x-auto bg-[theme(--color-dark-light)] shadow-inner">
            {["overview", "anime", "manga", "voices"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-black capitalize transition-all whitespace-nowrap text-xs sm:text-sm lg:text-base ${
                  activeTab === tab
                    ? "text-white bg-gradient-to-b from-[theme(--color-primary)] to-[theme(--color-primary-dark)] border-b-4 border-[theme(--color-accent)] shadow-lg"
                    : "text-[theme(--color-text-secondary)] hover:text-white hover:bg-[theme(--color-dark-card)] border-b-4 border-transparent"
                }`}
              >
                {tab === "overview" && "📖 "}
                {tab === "anime" && "🎬 "}
                {tab === "manga" && "📖 "}
                {tab === "voices" && "🎙️ "}
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span>📖</span> About
                  </h2>
                  <div className="bg-gradient-to-br from-[theme(--color-dark)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl">
                    <p className="text-sm sm:text-base text-white leading-relaxed whitespace-pre-line">
                      {character.about || "No information available."}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span>📊</span> Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoRow label="Name" value={character.name} />
                    <InfoRow
                      label="Kanji"
                      value={character.name_kanji || "N/A"}
                    />
                    <InfoRow label="Nicknames" value={nicknameText} />
                    <InfoRow
                      label="Favorites"
                      value={
                        character.favorites
                          ? character.favorites.toLocaleString()
                          : "0"
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ANIME ROLES */}
            {activeTab === "anime" && (
              <div>
                {animeRoles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {animeRoles.map((entry) => (
                      <div
                        key={`${entry.anime.mal_id}-${entry.role}`}
                        className="bg-gradient-to-b from-[theme(--color-dark)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/30 transition-all"
                      >
                        <img
                          src={
                            entry.anime.images?.jpg?.image_url ||
                            entry.anime.images?.webp?.image_url
                          }
                          alt={entry.anime.title}
                          className="w-full h-32 sm:h-40 object-cover"
                        />
                        <div className="p-2 sm:p-3">
                          <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                            {entry.anime.title}
                          </h3>
                          <p className="text-[theme(--color-primary)] text-[10px] sm:text-xs mt-1 font-semibold">
                            {entry.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="🎬" text="No anime roles available" />
                )}
              </div>
            )}

            {/* MANGA ROLES */}
            {activeTab === "manga" && (
              <div>
                {mangaRoles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {mangaRoles.map((entry) => (
                      <div
                        key={`${entry.manga.mal_id}-${entry.role}`}
                        className="bg-gradient-to-b from-[theme(--color-dark)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/30 transition-all"
                      >
                        <img
                          src={
                            entry.manga.images?.jpg?.image_url ||
                            entry.manga.images?.webp?.image_url
                          }
                          alt={entry.manga.title}
                          className="w-full h-32 sm:h-40 object-cover"
                        />
                        <div className="p-2 sm:p-3">
                          <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                            {entry.manga.title}
                          </h3>
                          <p className="text-[theme(--color-accent)] text-[10px] sm:text-xs mt-1 font-semibold">
                            {entry.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="📖" text="No manga roles available" />
                )}
              </div>
            )}

            {/* VOICE ACTORS */}
            {activeTab === "voices" && (
              <div>
                {voices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {voices.map((v) => (
                      <div
                        key={`${v.person.mal_id}-${v.language}`}
                        className="flex gap-3 sm:gap-4 bg-gradient-to-br from-[theme(--color-dark)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] rounded-xl p-3 sm:p-4 hover:border-[theme(--color-primary)] hover:shadow-lg hover:shadow-[theme(--color-primary)]/30 transition-all"
                      >
                        <img
                          src={
                            v.person.images?.jpg?.image_url ||
                            v.person.images?.webp?.image_url
                          }
                          alt={v.person.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-sm sm:text-base font-bold truncate">
                            {v.person.name}
                          </h3>
                          <p className="text-[theme(--color-accent-orange)] text-xs sm:text-sm font-semibold mt-1">
                            {v.language}
                          </p>
                          {v.anime && (
                            <p className="text-[theme(--color-text-secondary)] text-xs sm:text-sm mt-1 line-clamp-2">
                              🎬 {v.anime.title}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="🎙️" text="No voice actor data available" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* === small reusable components === */

const InfoRow = ({ label, value }) => (
  <div className="bg-gradient-to-br from-[theme(--color-dark)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-3 sm:p-4 rounded-xl transition-all">
    <strong className="text-[theme(--color-primary)] font-bold text-xs sm:text-sm">
      {label}:
    </strong>
    <span className="text-white ml-2 font-medium text-xs sm:text-sm break-words">
      {value}
    </span>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="bg-gradient-to-br from-[theme(--color-dark)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl hover:shadow-[theme(--color-primary)]/30 transition-all">
    <h3 className="text-[theme(--color-accent)] font-black mb-2 text-xs uppercase tracking-widest">
      {label}
    </h3>
    <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
      {value?.toLocaleString() || 0}
    </p>
  </div>
);

const ScoreRow = ({ score, total }) => {
  const percentage = total > 0 ? (score.votes / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2 sm:gap-4 bg-[theme(--color-dark)]/50 p-2 sm:p-3 rounded-xl border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all">
      <span className="text-white font-black w-8 sm:w-12 text-sm sm:text-lg text-center bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] rounded-lg py-1 sm:py-2">
        {score.score}
      </span>
      <div className="flex-1 bg-[theme(--color-dark-card)] border border-[theme(--color-border)] rounded-full h-6 sm:h-8 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-[theme(--color-primary)] via-[theme(--color-accent)] to-[theme(--color-primary)] h-full transition-all duration-500 flex items-center justify-end pr-2 sm:pr-3"
          style={{ width: `${percentage}%` }}
        >
          {score.votes > 0 && (
            <span className="text-white text-xs font-bold drop-shadow-lg">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <span className="text-white w-16 sm:w-20 lg:w-32 text-right text-xs sm:text-sm font-bold">
        {score.votes?.toLocaleString() || 0} votes
      </span>
    </div>
  );
};

const EmptyState = ({ icon, text }) => (
  <div className="text-center py-12 sm:py-16 text-[theme(--color-text-secondary)]">
    <div className="text-5xl sm:text-6xl mb-4">{icon}</div>
    <p className="text-base sm:text-lg font-semibold">{text}</p>
  </div>
);

export default CharacterDetail;
