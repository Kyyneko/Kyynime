import React, { useState, useEffect, useRef } from "react";
import {
  getAnimeFull,
  getAnimeCharacters,
  getAnimeVideos,
  getAnimeStatistics,
  getAnimeRecommendations,
  getAnimeStreaming,
  getAnimeThemes,
} from "../services/api";

const AnimeDetail = ({ animeId, onClose }) => {
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [videos, setVideos] = useState(null);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [streaming, setStreaming] = useState([]);
  const [themes, setThemes] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoadingRef = useRef(false);
  const loadedIdRef = useRef(null);

  useEffect(() => {
    if (isLoadingRef.current || loadedIdRef.current === animeId) {
      console.log("⚠️ Skipping duplicate load for anime", animeId);
      return;
    }
    loadAnimeData();
  }, [animeId]);

  const loadAnimeData = async () => {
    if (isLoadingRef.current) {
      console.log("⚠️ Already loading, skipping...");
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    console.log("🔄 Loading anime data for ID:", animeId);

    try {
      const results = await Promise.allSettled([
        getAnimeFull(animeId),
        getAnimeCharacters(animeId),
        getAnimeVideos(animeId),
        getAnimeStatistics(animeId),
        getAnimeRecommendations(animeId),
        getAnimeStreaming(animeId),
        getAnimeThemes(animeId),
      ]);

      const [
        animeResult,
        charResult,
        videoResult,
        statsResult,
        recResult,
        streamResult,
        themeResult,
      ] = results;

      if (animeResult.status === "fulfilled" && animeResult.value?.data) {
        setAnime(animeResult.value.data);
        loadedIdRef.current = animeId;
        console.log("✅ Anime data loaded successfully");
      } else {
        throw new Error("Failed to load anime details");
      }

      setCharacters(
        charResult.status === "fulfilled" && charResult.value?.data
          ? charResult.value.data.slice(0, 12)
          : []
      );

      const videosData =
        videoResult.status === "fulfilled" && videoResult.value?.data
          ? videoResult.value.data
          : { promo: [], episodes: [], music_videos: [] };

      console.log("🎬 Videos data:", videosData);
      console.log("🎬 Promo videos count:", videosData.promo?.length || 0);
      setVideos(videosData);

      setStats(
        statsResult.status === "fulfilled" && statsResult.value?.data
          ? statsResult.value.data
          : null
      );

      setRecommendations(
        recResult.status === "fulfilled" && recResult.value?.data
          ? recResult.value.data.slice(0, 6)
          : []
      );

      setStreaming(
        streamResult.status === "fulfilled" && streamResult.value?.data
          ? streamResult.value.data
          : []
      );

      setThemes(
        themeResult.status === "fulfilled" && themeResult.value?.data
          ? themeResult.value.data
          : { openings: [], endings: [] }
      );
    } catch (err) {
      console.error("❌ Error loading anime data:", err);
      setError(err.message || "Failed to load anime details");
      setAnime(null);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  const handleRecommendationClick = (newAnimeId) => {
    onClose();
    setTimeout(() => {
      window.location.href = `?anime=${newAnimeId}`;
    }, 300);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#6366f1]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-2xl">🎌</div>
            </div>
          </div>
          <p className="mt-6 text-gray-400 text-lg font-medium">
            Loading anime details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        <div className="bg-[#1a1f3a] rounded-2xl p-6 sm:p-8 max-w-md mx-4 text-center border-2 border-[#2d3454]">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Failed to Load Anime
          </h3>
          <p className="text-gray-400 mb-6 text-base">
            {error || "Unable to load anime details. Please try again later."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={loadAnimeData}
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

  const mainImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto animate-fade-in">
      <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto bg-[#1a1f3a] rounded-2xl shadow-2xl overflow-hidden relative">
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-xl sm:text-2xl shadow-lg"
            onClick={onClose}
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
                <img
                  src={mainImage}
                  alt={anime.title}
                  className="w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 object-cover rounded-xl shadow-2xl border-4 border-[#6366f1]/50 hover:border-[#6366f1] transition-all mx-auto lg:mx-0"
                />
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg break-words">
                    {anime.title}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-4 drop-shadow-md break-words">
                    {anime.title_japanese}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-black shadow-xl flex items-center gap-1 border-2 border-amber-400">
                      <span>⭐</span>
                      <span>{anime.score || "N/A"}</span>
                    </span>
                    <span className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] border-2 border-[#818cf8] px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-bold shadow-lg">
                      {anime.type}
                    </span>
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-emerald-400 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-bold shadow-lg">
                      {anime.status}
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-400 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-bold shadow-lg">
                      {anime.episodes || "?"} Episodes
                    </span>
                    {anime.rank && (
                      <span className="bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-yellow-400 px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-white font-black shadow-xl flex items-center gap-1">
                        <span>🏆</span>
                        <span>#{anime.rank}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="bg-[#6366f1]/30 backdrop-blur-sm border-2 border-[#6366f1] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg hover:bg-[#6366f1]/50 transition-all"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-[#2d3454] px-2 sm:px-4 lg:px-8 overflow-x-auto bg-[#151829] shadow-inner">
            {[
              "overview",
              "characters",
              "videos",
              "stats",
              "recommendations",
            ].map((tab) => (
              <button
                key={tab}
                className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-black capitalize transition-all whitespace-nowrap text-xs sm:text-sm lg:text-base ${
                  activeTab === tab
                    ? "text-white bg-gradient-to-b from-[#6366f1] to-[#4f46e5] border-b-4 border-[#8b5cf6] shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1f3a] border-b-4 border-transparent"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "overview" && "📖 "}
                {tab === "characters" && "👥 "}
                {tab === "videos" && "🎬 "}
                {tab === "stats" && "📊 "}
                {tab === "recommendations" && "💡 "}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span>📖</span> Synopsis
                  </h2>
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl">
                    <p className="text-sm sm:text-base text-white leading-relaxed">
                      {anime.synopsis || "No synopsis available."}
                    </p>
                  </div>
                </div>

                {anime.background && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span>ℹ️</span> Background
                    </h2>
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl">
                      <p className="text-sm sm:text-base text-white leading-relaxed">
                        {anime.background}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <span>📊</span> Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] hover:border-[#6366f1] p-3 sm:p-4 rounded-xl transition-all">
                      <strong className="text-[#6366f1] font-bold text-xs sm:text-sm">Aired:</strong>
                      <span className="text-white ml-2 font-medium text-xs sm:text-sm break-words">
                        {anime.aired?.string || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] hover:border-[#6366f1] p-3 sm:p-4 rounded-xl transition-all">
                      <strong className="text-[#6366f1] font-bold text-xs sm:text-sm">Duration:</strong>
                      <span className="text-white ml-2 font-medium text-xs sm:text-sm">
                        {anime.duration || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] hover:border-[#6366f1] p-3 sm:p-4 rounded-xl transition-all">
                      <strong className="text-[#6366f1] font-bold text-xs sm:text-sm">Rating:</strong>
                      <span className="text-white ml-2 font-medium text-xs sm:text-sm">
                        {anime.rating || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] hover:border-[#6366f1] p-3 sm:p-4 rounded-xl transition-all">
                      <strong className="text-[#6366f1] font-bold text-xs sm:text-sm">Studios:</strong>
                      <span className="text-white ml-2 font-medium text-xs sm:text-sm break-words">
                        {anime.studios?.map((s) => s.name).join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] hover:border-[#6366f1] p-3 sm:p-4 rounded-xl transition-all">
                      <strong className="text-[#6366f1] font-bold text-xs sm:text-sm">Source:</strong>
                      <span className="text-white ml-2 font-medium text-xs sm:text-sm">
                        {anime.source || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] hover:border-[#6366f1] p-3 sm:p-4 rounded-xl transition-all">
                      <strong className="text-[#6366f1] font-bold text-xs sm:text-sm">Season:</strong>
                      <span className="text-white ml-2 font-medium text-xs sm:text-sm capitalize">
                        {anime.season || ""} {anime.year || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {themes &&
                  (themes.openings?.length > 0 ||
                    themes.endings?.length > 0) && (
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <span>🎵</span> Theme Songs
                      </h2>
                      <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl space-y-4 sm:space-y-6">
                        {themes.openings?.length > 0 && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#8b5cf6] mb-2 sm:mb-3 flex items-center gap-2">
                              <span>▶️</span> Openings
                            </h3>
                            <ul className="space-y-2">
                              {themes.openings.map((op, idx) => (
                                <li
                                  key={idx}
                                  className="text-white bg-[#1a1f3a] p-2 sm:p-3 rounded-lg border border-[#2d3454] hover:border-[#6366f1] transition-all text-xs sm:text-sm"
                                >
                                  <span className="font-bold text-[#6366f1] mr-2">
                                    {idx + 1}.
                                  </span>
                                  {op}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {themes.endings?.length > 0 && (
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#8b5cf6] mb-2 sm:mb-3 flex items-center gap-2">
                              <span>⏹️</span> Endings
                            </h3>
                            <ul className="space-y-2">
                              {themes.endings.map((ed, idx) => (
                                <li
                                  key={idx}
                                  className="text-white bg-[#1a1f3a] p-2 sm:p-3 rounded-lg border border-[#2d3454] hover:border-[#6366f1] transition-all text-xs sm:text-sm"
                                >
                                  <span className="font-bold text-[#6366f1] mr-2">
                                    {idx + 1}.
                                  </span>
                                  {ed}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {streaming && streaming.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span>📺</span> Where to Watch
                    </h2>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {streaming.map((stream, idx) => (
                        <a
                          key={idx}
                          href={stream.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-2xl hover:shadow-[#6366f1]/50 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                        >
                          {stream.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                          src={char.character.images.jpg.image_url}
                          alt={char.character.name}
                          className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                        />
                        <div className="p-2 sm:p-3">
                          <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                            {char.character.name}
                          </h4>
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

            {activeTab === "videos" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Promotional Videos */}
                {videos?.promo && videos.promo.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span>🎬</span> Promotional Videos ({videos.promo.length})
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {videos.promo.map((video, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] rounded-xl overflow-hidden hover:border-[#6366f1] hover:shadow-2xl hover:shadow-[#6366f1]/30 transition-all"
                        >
                          <div className="aspect-video bg-black">
                            {video.trailer?.embed_url ? (
                              <iframe
                                src={`${video.trailer.embed_url}${
                                  video.trailer.embed_url.includes("?")
                                    ? "&"
                                    : "?"
                                }autoplay=0&rel=0&modestbranding=1`}
                                title={video.title || `Promo ${idx + 1}`}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                <span>Video not available</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3 sm:p-4 border-t-2 border-[#2d3454]">
                            <p className="text-white font-semibold text-xs sm:text-sm">
                              {video.title || `Promotional Video ${idx + 1}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Music Videos */}
                {videos?.music_videos && videos.music_videos.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span>🎵</span> Music Videos ({videos.music_videos.length})
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {videos.music_videos.map((video, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] rounded-xl overflow-hidden hover:border-[#6366f1] hover:shadow-2xl hover:shadow-[#6366f1]/30 transition-all"
                        >
                          <div className="aspect-video bg-black">
                            {video.video?.embed_url ? (
                              <iframe
                                src={`${video.video.embed_url}${
                                  video.video.embed_url.includes("?")
                                    ? "&"
                                    : "?"
                                }autoplay=0&rel=0&modestbranding=1`}
                                title={video.title || `Music Video ${idx + 1}`}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                <span>Video not available</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3 sm:p-4 border-t-2 border-[#2d3454]">
                            <p className="text-white font-semibold text-xs sm:text-sm">
                              {video.title || `Music Video ${idx + 1}`}
                            </p>
                            {video.meta?.author && (
                              <p className="text-gray-400 text-xs mt-1">
                                by {video.meta.author}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {(!videos?.promo || videos.promo.length === 0) &&
                  (!videos?.music_videos || videos.music_videos.length === 0) && (
                    <div className="text-center py-12 sm:py-16 text-gray-400">
                      <div className="text-5xl sm:text-6xl mb-4">🎬</div>
                      <p className="text-base sm:text-lg font-semibold">
                        No videos available for this anime
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Only promotional and music videos are available
                      </p>
                    </div>
                  )}
              </div>
            )}

            {activeTab === "stats" && stats && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl text-center hover:border-[#6366f1] hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all">
                    <h3 className="text-[#8b5cf6] font-black mb-2 text-xs uppercase tracking-widest">
                      Watching
                    </h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl md:text-4xl font-black text-white">
                      {stats.watching?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl text-center hover:border-[#6366f1] hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all">
                    <h3 className="text-[#8b5cf6] font-black mb-2 text-xs uppercase tracking-widest">
                      Completed
                    </h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl md:text-4xl font-black text-white">
                      {stats.completed?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl text-center hover:border-[#6366f1] hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all">
                    <h3 className="text-[#8b5cf6] font-black mb-2 text-xs uppercase tracking-widest">
                      On Hold
                    </h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl md:text-4xl font-black text-white">
                      {stats.on_hold?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl text-center hover:border-[#6366f1] hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all">
                    <h3 className="text-[#8b5cf6] font-black mb-2 text-xs uppercase tracking-widest">
                      Dropped
                    </h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl md:text-4xl font-black text-white">
                      {stats.dropped?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl text-center hover:border-[#6366f1] hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all">
                    <h3 className="text-[#8b5cf6] font-black mb-2 text-xs uppercase tracking-widest">
                      Plan to Watch
                    </h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl md:text-4xl font-black text-white">
                      {stats.plan_to_watch?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#151829] to-[#1a1f3a] border-2 border-[#2d3454] p-4 sm:p-6 rounded-xl text-center hover:border-[#6366f1] hover:shadow-xl hover:shadow-[#6366f1]/30 transition-all">
                    <h3 className="text-[#8b5cf6] font-black mb-2 text-xs uppercase tracking-widest">
                      Total
                    </h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl md:text-4xl font-black text-white">
                      {stats.total?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {stats.scores && stats.scores.length > 0 && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2">
                      <span>📊</span> Score Distribution
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {stats.scores.map((score) => (
                        <div
                          key={score.score}
                          className="flex items-center gap-2 sm:gap-4 bg-[#151829]/50 p-2 sm:p-3 rounded-xl border border-[#2d3454] hover:border-[#6366f1] transition-all"
                        >
                          <span className="text-white font-black w-8 sm:w-12 text-sm sm:text-lg text-center bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg py-1 sm:py-2">
                            {score.score}
                          </span>
                          <div className="flex-1 bg-[#1a1f3a] border border-[#2d3454] rounded-full h-6 sm:h-8 overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1] h-full transition-all duration-500 flex items-center justify-end pr-2 sm:pr-3"
                              style={{
                                width: `${
                                  stats.total > 0
                                    ? (score.votes / stats.total) * 100
                                    : 0
                                }%`,
                              }}
                            >
                              {score.votes > 0 && (
                                <span className="text-white text-xs font-bold drop-shadow-lg">
                                  {((score.votes / stats.total) * 100).toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-white w-16 sm:w-20 lg:w-32 text-right text-xs sm:text-sm font-bold">
                            {score.votes?.toLocaleString() || 0} votes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "recommendations" && (
              <div>
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.entry.mal_id}
                        className="bg-[#151829] border border-[#2d3454] rounded-xl overflow-hidden hover:scale-105 hover:border-[#6366f1] transition-all cursor-pointer"
                        onClick={() =>
                          handleRecommendationClick(rec.entry.mal_id)
                        }
                      >
                        <img
                          src={rec.entry.images.jpg.image_url}
                          alt={rec.entry.title}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                        <div className="p-2 sm:p-3">
                          <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                            {rec.entry.title}
                          </h4>
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

export default AnimeDetail;