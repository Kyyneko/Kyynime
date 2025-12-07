import React, { useState, useEffect, useRef } from "react";
import {
  getMangaFull,
  getMangaCharacters,
  getMangaStatistics,
  getMangaRecommendations,
} from "../services/api";

const MangaDetail = ({ mangaId, onClose }) => {
  const [manga, setManga] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false);
  const loadedIdRef = useRef(null);

  useEffect(() => {
    setActiveTab("overview");
    if (isLoadingRef.current || loadedIdRef.current === mangaId) return;
    loadMangaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaId]);

  const loadMangaData = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        getMangaFull(mangaId),
        getMangaCharacters(mangaId),
        getMangaStatistics(mangaId),
        getMangaRecommendations(mangaId),
      ]);

      const [fullRes, charRes, statsRes, recRes] = results;

      if (fullRes.status === "fulfilled" && fullRes.value?.data) {
        setManga(fullRes.value.data);
        loadedIdRef.current = mangaId;
      } else {
        throw new Error("Failed to load manga details");
      }

      setCharacters(
        charRes.status === "fulfilled" && charRes.value?.data
          ? charRes.value.data.slice(0, 12)
          : []
      );

      setStats(
        statsRes.status === "fulfilled" && statsRes.value?.data
          ? statsRes.value.data
          : null
      );

      setRecommendations(
        recRes.status === "fulfilled" && recRes.value?.data
          ? recRes.value.data.slice(0, 6)
          : []
      );
    } catch (err) {
      console.error("Error loading manga data:", err);
      setError(err.message || "Failed to load manga details");
      setManga(null);
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
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#6366f1]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-2xl">📖</div>
            </div>
          </div>
          <p className="mt-6 text-gray-400 text-lg font-medium">
            Loading manga details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        <div className="bg-[#1a1f3a] rounded-2xl p-6 sm:p-8 max-w-md mx-4 text-center border-2 border-[#2d3454]">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Failed to Load Manga
          </h3>
          <p className="text-gray-400 mb-6 text-base">
            {error || "Unable to load manga details. Please try again later."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={loadMangaData}
              className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              🔄 Retry
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#2d3454] text-white font-bold rounded-xl hover:bg-[#374062] transform hover:scale-105 transition-all duration-300 border border-[#2d3454]"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage =
    manga.images?.jpg?.large_image_url ||
    manga.images?.jpg?.image_url ||
    manga.images?.webp?.large_image_url ||
    manga.images?.webp?.image_url;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto animate-fade-in">
      <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto bg-[#1a1f3a] rounded-2xl shadow-2xl overflow-hidden relative">
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
              backgroundImage: window.innerWidth >= 640 ? `linear-gradient(rgba(0,0,0,0.85), rgba(26,31,58,0.98)), url(${mainImage})` : 'none',
              backgroundColor: '#1a1f3a'
            }}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={manga.title}
                    className="w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 object-cover rounded-xl shadow-2xl border-4 border-[#6366f1]/50 hover:border-[#6366f1] transition-all mx-auto lg:mx-0"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg break-words">
                    {manga.title}
                  </h1>
                  {manga.title_japanese && (
                    <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-2 drop-shadow-md break-words">
                      {manga.title_japanese}
                    </p>
                  )}
                  {manga.title_english && (
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 break-words">
                      English: {manga.title_english}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-black shadow-xl flex items-center gap-1 border-2 border-amber-400">
                      <span>⭐</span>
                      <span>{manga.score || "N/A"}</span>
                    </span>
                    <span className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] border-2 border-[#818cf8] px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-bold shadow-lg">
                      {manga.type}
                    </span>
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-emerald-400 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-bold shadow-lg">
                      {manga.status}
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-400 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-bold shadow-lg">
                      {manga.chapters || "?"} Chapters
                    </span>
                    {manga.volumes && (
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-blue-400 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-bold shadow-lg">
                        {manga.volumes} Volumes
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {manga.genres?.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="bg-[#6366f1]/30 backdrop-blur-sm border-2 border-[#6366f1] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-[#6366f1]/50 transition-all"
                      >
                        {genre.name}
                      </span>
                    ))}
                    {manga.themes?.map((theme) => (
                      <span
                        key={theme.mal_id}
                        className="bg-pink-500/30 backdrop-blur-sm border-2 border-pink-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-pink-500/50 transition-all"
                      >
                        {theme.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-[#2d3454] px-2 sm:px-4 lg:px-8 overflow-x-auto bg-[#151829] shadow-inner">
            {["overview", "characters", "stats", "recommendations"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-black capitalize transition-all whitespace-nowrap text-xs sm:text-sm lg:text-base ${
                    activeTab === tab
                      ? "text-white bg-gradient-to-b from-[#6366f1] to-[#4f46e5] border-b-4 border-[#8b5cf6] shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1f3a] border-b-4 border-transparent"
                  }`}
                >
                  {tab === "overview" && "📖 "}
                  {tab === "characters" && "👥 "}
                  {tab === "stats" && "📊 "}
                  {tab === "recommendations" && "💡 "}
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span>📖</span> Synopsis
                  </h2>
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl">
                    <p className="text-sm sm:text-base text-white leading-relaxed">
                      {manga.synopsis || "No synopsis available."}
                    </p>
                  </div>
                </div>

                {manga.background && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span>ℹ️</span> Background
                    </h2>
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl">
                      <p className="text-sm sm:text-base text-white leading-relaxed">
                        {manga.background}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span>📊</span> Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoRow label="Type" value={manga.type || "N/A"} />
                    <InfoRow label="Status" value={manga.status || "N/A"} />
                    <InfoRow
                      label="Chapters"
                      value={manga.chapters?.toString() || "Unknown"}
                    />
                    <InfoRow
                      label="Volumes"
                      value={manga.volumes?.toString() || "Unknown"}
                    />
                    <InfoRow label="Score" value={manga.score || "N/A"} />
                    <InfoRow
                      label="Scored By"
                      value={manga.scored_by?.toLocaleString() || "N/A"}
                    />
                    <InfoRow label="Rank" value={`#${manga.rank}` || "N/A"} />
                    <InfoRow
                      label="Popularity"
                      value={`#${manga.popularity}` || "N/A"}
                    />
                    <InfoRow
                      label="Members"
                      value={manga.members?.toLocaleString() || "N/A"}
                    />
                    <InfoRow
                      label="Favorites"
                      value={manga.favorites?.toLocaleString() || "N/A"}
                    />
                    <InfoRow
                      label="Authors"
                      value={
                        manga.authors?.map((a) => a.name).join(", ") || "N/A"
                      }
                    />
                    <InfoRow
                      label="Serializations"
                      value={
                        manga.serializations
                          ?.map((s) => s.name)
                          .join(", ") || "N/A"
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CHARACTERS */}
            {activeTab === "characters" && (
              <div>
                {characters.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {characters.map((char) => (
                      <div
                        key={char.character.mal_id}
                        className="bg-gradient-to-b from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] rounded-xl overflow-hidden hover:scale-105 hover:border-[#6366f1] hover:shadow-2xl hover:shadow-[#6366f1]/30 transition-all"
                      >
                        <img
                          src={char.character.images?.jpg?.image_url}
                          alt={char.character.name}
                          className="w-full h-32 sm:h-40 object-cover"
                        />
                        <div className="p-2 sm:p-3">
                          <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                            {char.character.name}
                          </h3>
                          <p className="text-[#6366f1] text-xs mt-1 font-semibold">
                            {char.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16 text-gray-400">
                    <div className="text-5xl sm:text-6xl mb-4">👥</div>
                    <p className="text-base sm:text-lg font-semibold">
                      No character information available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STATS */}
            {activeTab === "stats" && stats && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <StatBox label="Reading" value={stats.reading} />
                  <StatBox label="Completed" value={stats.completed} />
                  <StatBox label="On Hold" value={stats.on_hold} />
                  <StatBox label="Dropped" value={stats.dropped} />
                  <StatBox label="Plan to Read" value={stats.plan_to_read} />
                  <StatBox label="Total" value={stats.total} />
                </div>

                {stats.scores && stats.scores.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                      <span>📊</span> Score Distribution
                    </h2>
                    <div className="space-y-2 sm:space-y-3">
                      {stats.scores.map((score) => (
                        <ScoreRow
                          key={score.score}
                          score={score}
                          total={stats.total}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RECOMMENDATIONS */}
            {activeTab === "recommendations" && (
              <div>
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.entry.mal_id}
                        className="bg-[#151829] border border-[#2d3454] rounded-xl overflow-hidden hover:scale-105 hover:border-[#6366f1] transition-all cursor-pointer"
                      >
                        <img
                          src={rec.entry.images?.jpg?.large_image_url}
                          alt={rec.entry.title}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                        <div className="p-2 sm:p-3">
                          <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                            {rec.entry.title}
                          </h3>
                          <p className="text-[#6366f1] text-xs mt-1 font-semibold">
                            👍 {rec.votes} votes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16 text-gray-400">
                    <div className="text-5xl sm:text-6xl mb-4">💡</div>
                    <p className="text-base sm:text-lg font-semibold">
                      No recommendations available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] hover:border-[#6366f1] p-3 sm:p-4 rounded-xl transition-all">
    <strong className="text-[#6366f1] font-bold text-xs sm:text-sm">{label}:</strong>
    <span className="text-white ml-2 font-medium text-xs sm:text-sm break-words">{value}</span>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl text-center hover:border-[#6366f1] hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all">
    <h3 className="text-[#8b5cf6] font-black mb-2 text-xs uppercase tracking-widest">
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
    <div className="flex items-center gap-2 sm:gap-4 bg-[#151829]/50 p-2 sm:p-3 rounded-xl border border-[#2d3454] hover:border-[#6366f1] transition-all">
      <span className="text-white font-black w-8 sm:w-12 text-sm sm:text-lg text-center bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg py-1 sm:py-2">
        {score.score}
      </span>
      <div className="flex-1 bg-[#1a1f3a] border border-[#2d3454] rounded-full h-6 sm:h-8 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1] h-full transition-all duration-500 flex items-center justify-end pr-2 sm:pr-3"
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

export default MangaDetail;