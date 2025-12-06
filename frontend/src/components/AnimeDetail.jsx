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
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[theme(--color-primary)]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-2xl">🎌</div>
            </div>
          </div>
          <p className="mt-6 text-[theme(--color-text-secondary)] text-lg font-medium">
            Loading anime details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        <div className="bg-[theme(--color-dark-card)] rounded-2xl p-8 max-w-md mx-4 text-center border-2 border-[theme(--color-border)]">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Failed to Load Anime
          </h3>
          <p className="text-[theme(--color-text-secondary)] mb-6 text-base">
            {error || "Unable to load anime details. Please try again later."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadAnimeData}
              className="px-6 py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              🔄 Retry
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[theme(--color-dark-light)] text-white font-bold rounded-xl hover:bg-[theme(--color-border)] transform hover:scale-105 transition-all duration-300 border border-[theme(--color-border)]"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto animate-fade-in">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-[theme(--color-dark-light)] rounded-2xl shadow-2xl overflow-hidden relative">
          <button
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-xl shadow-lg"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Header */}
          <div
            className="relative h-96 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(10,14,39,0.98)), url(${
                anime.images?.jpg?.large_image_url ||
                anime.images?.jpg?.image_url
              })`,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={
                    anime.images?.jpg?.large_image_url ||
                    anime.images?.jpg?.image_url
                  }
                  alt={anime.title}
                  className="w-40 h-60 md:w-48 md:h-72 object-cover rounded-xl shadow-2xl border-4 border-[theme(--color-primary)]/50 hover:border-[theme(--color-primary)] transition-all"
                />
                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
                    {anime.title}
                  </h1>
                  <p className="text-[theme(--color-text-secondary)] text-sm md:text-lg mb-4 drop-shadow-md">
                    {anime.title_japanese}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-xl text-white font-black shadow-xl flex items-center gap-1 border-2 border-amber-400">
                      <span>⭐</span>
                      <span>{anime.score || "N/A"}</span>
                    </span>
                    <span className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] border-2 border-[theme(--color-primary-light)] px-4 py-2 rounded-xl text-white font-bold shadow-lg">
                      {anime.type}
                    </span>
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-emerald-400 px-4 py-2 rounded-xl text-white font-bold shadow-lg">
                      {anime.status}
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-400 px-4 py-2 rounded-xl text-white font-bold shadow-lg">
                      {anime.episodes || "?"} Episodes
                    </span>
                    {anime.rank && (
                      <span className="bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-yellow-400 px-4 py-2 rounded-xl text-white font-black shadow-xl flex items-center gap-1">
                        <span>🏆</span>
                        <span>#{anime.rank}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="bg-[theme(--color-primary)]/30 backdrop-blur-sm border-2 border-[theme(--color-primary)] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg hover:bg-[theme(--color-primary)]/50 transition-all"
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
          <div className="flex border-b-2 border-[theme(--color-border)] px-4 md:px-8 overflow-x-auto bg-[theme(--color-dark-card)] shadow-inner">
            {[
              "overview",
              "characters",
              "videos",
              "stats",
              "recommendations",
            ].map((tab) => (
              <button
                key={tab}
                className={`px-4 md:px-6 py-4 font-black capitalize transition-all whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab
                    ? "text-white bg-gradient-to-b from-[theme(--color-primary)] to-[theme(--color-primary-dark)] border-b-4 border-[theme(--color-accent)] shadow-lg"
                    : "text-[theme(--color-text-secondary)] hover:text-white hover:bg-[theme(--color-dark-light)] border-b-4 border-transparent"
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
          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>📖</span> Synopsis
                  </h2>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl">
                    <p className="text-white leading-relaxed text-base">
                      {anime.synopsis || "No synopsis available."}
                    </p>
                  </div>
                </div>

                {anime.background && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>ℹ️</span> Background
                    </h2>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl">
                      <p className="text-white leading-relaxed text-base">
                        {anime.background}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>📊</span> Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-4 rounded-xl transition-all">
                      <strong className="text-[theme(--color-primary)] font-bold">
                        Aired:
                      </strong>
                      <span className="text-white ml-2 font-medium">
                        {anime.aired?.string || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-4 rounded-xl transition-all">
                      <strong className="text-[theme(--color-primary)] font-bold">
                        Duration:
                      </strong>
                      <span className="text-white ml-2 font-medium">
                        {anime.duration || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-4 rounded-xl transition-all">
                      <strong className="text-[theme(--color-primary)] font-bold">
                        Rating:
                      </strong>
                      <span className="text-white ml-2 font-medium">
                        {anime.rating || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-4 rounded-xl transition-all">
                      <strong className="text-[theme(--color-primary)] font-bold">
                        Studios:
                      </strong>
                      <span className="text-white ml-2 font-medium">
                        {anime.studios?.map((s) => s.name).join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-4 rounded-xl transition-all">
                      <strong className="text-[theme(--color-primary)] font-bold">
                        Source:
                      </strong>
                      <span className="text-white ml-2 font-medium">
                        {anime.source || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-4 rounded-xl transition-all">
                      <strong className="text-[theme(--color-primary)] font-bold">
                        Season:
                      </strong>
                      <span className="text-white ml-2 font-medium capitalize">
                        {anime.season || ""} {anime.year || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {themes &&
                  (themes.openings?.length > 0 ||
                    themes.endings?.length > 0) && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>🎵</span> Theme Songs
                      </h2>
                      <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl space-y-6">
                        {themes.openings?.length > 0 && (
                          <div>
                            <h3 className="text-xl font-bold text-[theme(--color-accent)] mb-3 flex items-center gap-2">
                              <span>▶️</span> Openings
                            </h3>
                            <ul className="space-y-2">
                              {themes.openings.map((op, idx) => (
                                <li
                                  key={idx}
                                  className="text-white bg-[theme(--color-dark-light)] p-3 rounded-lg border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all"
                                >
                                  <span className="font-bold text-[theme(--color-primary)] mr-2">
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
                            <h3 className="text-xl font-bold text-[theme(--color-accent)] mb-3 flex items-center gap-2">
                              <span>⏹️</span> Endings
                            </h3>
                            <ul className="space-y-2">
                              {themes.endings.map((ed, idx) => (
                                <li
                                  key={idx}
                                  className="text-white bg-[theme(--color-dark-light)] p-3 rounded-lg border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all"
                                >
                                  <span className="font-bold text-[theme(--color-primary)] mr-2">
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
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>📺</span> Where to Watch
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {streaming.map((stream, idx) => (
                        <a
                          key={idx}
                          href={stream.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {characters.map((char) => (
                      <div
                        key={char.character.mal_id}
                        className="bg-gradient-to-b from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/30 transition-all"
                      >
                        <img
                          src={char.character.images.jpg.image_url}
                          alt={char.character.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="text-white text-sm font-bold line-clamp-2">
                            {char.character.name}
                          </h4>
                          <p className="text-[theme(--color-primary)] text-xs mt-1 font-semibold">
                            {char.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[theme(--color-text-secondary)]">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-lg font-semibold">
                      No character information available
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "videos" && (
              <div className="space-y-8">
                {/* Promotional Videos */}
                {videos?.promo && videos.promo.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>🎬</span> Promotional Videos ({videos.promo.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videos.promo.map((video, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:border-[theme(--color-primary)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/30 transition-all"
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
                          <div className="p-4 border-t-2 border-[theme(--color-border)]">
                            <p className="text-white font-semibold">
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
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>🎵</span> Music Videos ({videos.music_videos.length}
                      )
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videos.music_videos.map((video, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:border-[theme(--color-primary)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/30 transition-all"
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
                          <div className="p-4 border-t-2 border-[theme(--color-border)]">
                            <p className="text-white font-semibold">
                              {video.title || `Music Video ${idx + 1}`}
                            </p>
                            {video.meta?.author && (
                              <p className="text-[theme(--color-text-secondary)] text-sm mt-1">
                                by {video.meta.author}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State - hanya untuk promo & music videos */}
                {(!videos?.promo || videos.promo.length === 0) &&
                  (!videos?.music_videos ||
                    videos.music_videos.length === 0) && (
                    <div className="text-center py-12 text-[theme(--color-text-secondary)]">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-lg font-semibold">
                        No videos available for this anime
                      </p>
                      <p className="text-sm text-[theme(--color-text-muted)] mt-2">
                        Only promotional and music videos are available
                      </p>
                    </div>
                  )}
              </div>
            )}

            {activeTab === "stats" && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl hover:shadow-[theme(--color-primary)]/30 transition-all">
                    <h3 className="text-[theme(--color-accent)] font-black mb-3 text-xs uppercase tracking-widest">
                      Watching
                    </h3>
                    <p className="text-white text-3xl md:text-4xl font-black">
                      {stats.watching?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl hover:shadow-[theme(--color-primary)]/30 transition-all">
                    <h3 className="text-[theme(--color-accent)] font-black mb-3 text-xs uppercase tracking-widest">
                      Completed
                    </h3>
                    <p className="text-white text-3xl md:text-4xl font-black">
                      {stats.completed?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl hover:shadow-[theme(--color-primary)]/30 transition-all">
                    <h3 className="text-[theme(--color-accent)] font-black mb-3 text-xs uppercase tracking-widest">
                      On Hold
                    </h3>
                    <p className="text-white text-3xl md:text-4xl font-black">
                      {stats.on_hold?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl hover:shadow-[theme(--color-primary)]/30 transition-all">
                    <h3 className="text-[theme(--color-accent)] font-black mb-3 text-xs uppercase tracking-widest">
                      Dropped
                    </h3>
                    <p className="text-white text-3xl md:text-4xl font-black">
                      {stats.dropped?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl hover:shadow-[theme(--color-primary)]/30 transition-all">
                    <h3 className="text-[theme(--color-accent)] font-black mb-3 text-xs uppercase tracking-widest">
                      Plan to Watch
                    </h3>
                    <p className="text-white text-3xl md:text-4xl font-black">
                      {stats.plan_to_watch?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-card)] to-[theme(--color-dark-light)] border-2 border-[theme(--color-border)] p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl hover:shadow-[theme(--color-primary)]/30 transition-all">
                    <h3 className="text-[theme(--color-accent)] font-black mb-3 text-xs uppercase tracking-widest">
                      Total
                    </h3>
                    <p className="text-white text-3xl md:text-4xl font-black">
                      {stats.total?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {stats.scores && stats.scores.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                      <span>📊</span> Score Distribution
                    </h3>
                    <div className="space-y-3">
                      {stats.scores.map((score) => (
                        <div
                          key={score.score}
                          className="flex items-center gap-4 bg-[theme(--color-dark-card)]/50 p-3 rounded-xl border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all"
                        >
                          <span className="text-white font-black w-12 text-lg text-center bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] rounded-lg py-2">
                            {score.score}
                          </span>
                          <div className="flex-1 bg-[theme(--color-dark-light)] border border-[theme(--color-border)] rounded-full h-8 overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-[theme(--color-primary)] via-[theme(--color-accent)] to-[theme(--color-primary)] h-full transition-all duration-500 flex items-center justify-end pr-3"
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
                                  {((score.votes / stats.total) * 100).toFixed(
                                    1
                                  )}
                                  %
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-white w-32 text-right text-sm font-bold">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.entry.mal_id}
                        className="bg-[theme(--color-dark-card)] border border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] transition-all cursor-pointer"
                        onClick={() =>
                          handleRecommendationClick(rec.entry.mal_id)
                        }
                      >
                        <img
                          src={rec.entry.images.jpg.image_url}
                          alt={rec.entry.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="text-white text-sm font-bold line-clamp-2">
                            {rec.entry.title}
                          </h4>
                          <p className="text-[theme(--color-primary)] text-xs mt-1 font-semibold">
                            👍 {rec.votes} votes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[theme(--color-text-secondary)]">
                    <div className="text-6xl mb-4">💡</div>
                    <p className="text-lg font-semibold">
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
