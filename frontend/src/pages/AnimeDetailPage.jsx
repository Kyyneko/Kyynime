import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getAnimeFull, getAnimeCharacters, getAnimeVideos, getAnimeStatistics, getAnimeRecommendations, getAnimeStreaming, getAnimeThemes } from '../services/api';
import { SkeletonDetail } from '../components/shared/SkeletonCard';

const AnimeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: animeData, isLoading, error } = useQuery({
    queryKey: ['animeFull', id],
    queryFn: () => getAnimeFull(id),
    staleTime: 10 * 60 * 1000,
  });

  const { data: charsData } = useQuery({
    queryKey: ['animeChars', id],
    queryFn: () => getAnimeCharacters(id),
    staleTime: 10 * 60 * 1000,
  });

  const { data: videosData } = useQuery({
    queryKey: ['animeVideos', id],
    queryFn: () => getAnimeVideos(id),
    staleTime: 10 * 60 * 1000,
  });

  const { data: statsData } = useQuery({
    queryKey: ['animeStats', id],
    queryFn: () => getAnimeStatistics(id),
    staleTime: 10 * 60 * 1000,
  });

  const { data: recsData } = useQuery({
    queryKey: ['animeRecs', id],
    queryFn: () => getAnimeRecommendations(id),
    staleTime: 10 * 60 * 1000,
  });

  const { data: streamData } = useQuery({
    queryKey: ['animeStream', id],
    queryFn: () => getAnimeStreaming(id),
    staleTime: 10 * 60 * 1000,
  });

  const { data: themesData } = useQuery({
    queryKey: ['animeThemes', id],
    queryFn: () => getAnimeThemes(id),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('overview');
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-8">
        <SkeletonDetail />
      </div>
    );
  }

  if (error || !animeData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
        <div className="text-8xl mb-6">😔</div>
        <h3 className="text-3xl font-black text-white mb-4">Failed to Load Anime</h3>
        <p className="text-[theme(--color-text-secondary)] mb-8 text-lg">{error?.message || 'Anime not found'}</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all">
          ← Go Back
        </button>
      </div>
    );
  }

  const anime = animeData.data;
  const characters = charsData?.data?.slice(0, 12) || [];
  const videos = videosData?.data || { promo: [], music_videos: [] };
  const stats = statsData?.data;
  const recommendations = recsData?.data?.slice(0, 6) || [];
  const streaming = streamData?.data || [];
  const themes = themesData?.data || { openings: [], endings: [] };
  const mainImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  const tabs = ['overview', 'characters', 'videos', 'stats', 'recommendations'];
  const tabIcons = { overview: '📖', characters: '👥', videos: '🎬', stats: '📊', recommendations: '💡' };

  return (
    <>
      <Helmet>
        <title>{anime.title} — Kyynime</title>
        <meta name="description" content={anime.synopsis?.substring(0, 160) || `Details about ${anime.title}`} />
        <meta property="og:title" content={`${anime.title} — Kyynime`} />
        <meta property="og:description" content={anime.synopsis?.substring(0, 160)} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:type" content="video.tv_show" />
      </Helmet>

      <div className="animate-fade-in">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[theme(--color-text-muted)] hover:text-white transition-colors mb-6 font-medium cursor-pointer">
          ← Back
        </button>

        <div className="bg-[theme(--color-dark-card)] rounded-2xl shadow-2xl overflow-hidden border border-[theme(--color-border)]">
          {/* Header */}
          <div className="relative bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(10,14,39,0.85), rgba(30,39,73,0.98)), url(${mainImage})` }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                <img src={mainImage} alt={anime.title} className="w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 object-cover rounded-xl shadow-2xl border-4 border-[theme(--color-primary)]/50 hover:border-[theme(--color-primary)] transition-all mx-auto lg:mx-0" />
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg">{anime.title}</h1>
                  <p className="text-sm sm:text-base lg:text-lg text-[theme(--color-text-muted)] mb-4">{anime.title_japanese}</p>
                  <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm">
                    {anime.score && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-xl text-white font-black shadow-xl flex items-center gap-1 border-2 border-amber-400">⭐ {anime.score}</span>
                    )}
                    <span className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] border-2 border-[theme(--color-primary-light)] px-3 py-1 rounded-xl text-white font-bold shadow-lg">{anime.type}</span>
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-emerald-400 px-3 py-1 rounded-xl text-white font-bold shadow-lg">{anime.status}</span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-400 px-3 py-1 rounded-xl text-white font-bold shadow-lg">{anime.episodes || '?'} Episodes</span>
                    {anime.rank && (
                      <span className="bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-yellow-400 px-3 py-1 rounded-xl text-white font-black shadow-xl flex items-center gap-1">🏆 #{anime.rank}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map(g => (
                      <span key={g.mal_id} className="bg-[theme(--color-primary)]/30 backdrop-blur-sm border-2 border-[theme(--color-primary)] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">{g.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-[theme(--color-border)] px-2 sm:px-4 lg:px-8 overflow-x-auto bg-[theme(--color-dark-light)] shadow-inner">
            {tabs.map(tab => (
              <button key={tab} className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-black capitalize transition-all whitespace-nowrap text-xs sm:text-sm lg:text-base ${activeTab === tab ? 'text-white bg-gradient-to-b from-[theme(--color-primary)] to-[theme(--color-primary-dark)] border-b-4 border-[theme(--color-primary-light)] shadow-lg' : 'text-[theme(--color-text-muted)] hover:text-white hover:bg-[theme(--color-dark-card)] border-b-4 border-transparent'}`} onClick={() => setActiveTab(tab)}>
                {tabIcons[tab]} {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">📖 Synopsis</h2>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl">
                    <p className="text-sm sm:text-base text-white leading-relaxed">{anime.synopsis || 'No synopsis available.'}</p>
                  </div>
                </div>

                {anime.background && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">ℹ️ Background</h2>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl">
                      <p className="text-sm sm:text-base text-white leading-relaxed">{anime.background}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">📊 Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Aired', value: anime.aired?.string },
                      { label: 'Duration', value: anime.duration },
                      { label: 'Rating', value: anime.rating },
                      { label: 'Studios', value: anime.studios?.map(s => s.name).join(', ') },
                      { label: 'Source', value: anime.source },
                      { label: 'Season', value: `${anime.season || ''} ${anime.year || 'N/A'}` },
                    ].map(info => (
                      <div key={info.label} className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-3 sm:p-4 rounded-xl transition-all">
                        <strong className="text-[theme(--color-primary)] font-bold text-xs sm:text-sm">{info.label}:</strong>
                        <span className="text-white ml-2 font-medium text-xs sm:text-sm">{info.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {themes && (themes.openings?.length > 0 || themes.endings?.length > 0) && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">🎵 Theme Songs</h2>
                    <div className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl space-y-4">
                      {themes.openings?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-[theme(--color-primary-light)] mb-2">▶️ Openings</h3>
                          <ul className="space-y-2">
                            {themes.openings.map((op, i) => (
                              <li key={i} className="text-white bg-[theme(--color-dark-card)] p-2 sm:p-3 rounded-lg border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all text-xs sm:text-sm">
                                <span className="font-bold text-[theme(--color-primary)] mr-2">{i + 1}.</span>{op}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {themes.endings?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-[theme(--color-primary-light)] mb-2">⏹️ Endings</h3>
                          <ul className="space-y-2">
                            {themes.endings.map((ed, i) => (
                              <li key={i} className="text-white bg-[theme(--color-dark-card)] p-2 sm:p-3 rounded-lg border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all text-xs sm:text-sm">
                                <span className="font-bold text-[theme(--color-primary)] mr-2">{i + 1}.</span>{ed}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {streaming.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">📺 Where to Watch</h2>
                    <div className="flex flex-wrap gap-2">
                      {streaming.map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 text-white px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 text-xs sm:text-sm">{s.name}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'characters' && (
              <div>
                {characters.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {characters.map(char => (
                      <Link key={char.character.mal_id} to={`/characters/${char.character.mal_id}`} className="bg-gradient-to-b from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] hover:shadow-2xl hover:shadow-[theme(--color-primary)]/30 transition-all">
                        <img src={char.character.images.jpg.image_url} alt={char.character.name} className="w-full h-32 sm:h-40 lg:h-48 object-cover" />
                        <div className="p-2 sm:p-3">
                          <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-2">{char.character.name}</h4>
                          <p className="text-[theme(--color-primary)] text-xs mt-1 font-semibold">{char.role}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-[theme(--color-text-muted)]">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-lg font-semibold">No character information available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-8">
                {videos?.promo?.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">🎬 Promotional Videos ({videos.promo.length})</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {videos.promo.map((v, i) => (
                        <div key={i} className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:border-[theme(--color-primary)] transition-all">
                          <div className="aspect-video bg-black">
                            {v.trailer?.embed_url ? (
                              <iframe src={`${v.trailer.embed_url}${v.trailer.embed_url.includes('?') ? '&' : '?'}autoplay=0&rel=0`} title={v.title || `Promo ${i + 1}`} className="w-full h-full" frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white">Video not available</div>
                            )}
                          </div>
                          <div className="p-3 border-t-2 border-[theme(--color-border)]">
                            <p className="text-white font-semibold text-sm">{v.title || `Promotional Video ${i + 1}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(!videos?.promo?.length && !videos?.music_videos?.length) && (
                  <div className="text-center py-16 text-[theme(--color-text-muted)]">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-lg font-semibold">No videos available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Watching', value: stats.watching },
                    { label: 'Completed', value: stats.completed },
                    { label: 'On Hold', value: stats.on_hold },
                    { label: 'Dropped', value: stats.dropped },
                    { label: 'Plan to Watch', value: stats.plan_to_watch },
                    { label: 'Total', value: stats.total },
                  ].map(s => (
                    <div key={s.label} className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl text-center hover:border-[theme(--color-primary)] hover:shadow-xl transition-all">
                      <h3 className="text-[theme(--color-primary-light)] font-black mb-2 text-xs uppercase tracking-widest">{s.label}</h3>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">{s.value?.toLocaleString() || 0}</p>
                    </div>
                  ))}
                </div>
                {stats.scores?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-black text-white mb-4">📊 Score Distribution</h3>
                    <div className="space-y-2">
                      {stats.scores.map(sc => (
                        <div key={sc.score} className="flex items-center gap-2 sm:gap-4 bg-[theme(--color-dark-light)]/50 p-2 sm:p-3 rounded-xl border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all">
                          <span className="text-white font-black w-8 sm:w-12 text-sm sm:text-lg text-center bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] rounded-lg py-1">{sc.score}</span>
                          <div className="flex-1 bg-[theme(--color-dark-card)] border border-[theme(--color-border)] rounded-full h-6 sm:h-8 overflow-hidden">
                            <div className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-light)] h-full transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${stats.total > 0 ? (sc.votes / stats.total) * 100 : 0}%` }}>
                              {sc.votes > 0 && <span className="text-white text-xs font-bold">{((sc.votes / stats.total) * 100).toFixed(1)}%</span>}
                            </div>
                          </div>
                          <span className="text-white w-16 sm:w-24 text-right text-xs sm:text-sm font-bold">{sc.votes?.toLocaleString()} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {recommendations.map(rec => (
                      <Link key={rec.entry.mal_id} to={`/anime/${rec.entry.mal_id}`} className="bg-[theme(--color-dark-light)] border border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] transition-all">
                        <img src={rec.entry.images.jpg.image_url} alt={rec.entry.title} className="w-full h-40 sm:h-48 object-cover" />
                        <div className="p-2 sm:p-3">
                          <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-2">{rec.entry.title}</h4>
                          <p className="text-[theme(--color-primary)] text-xs mt-1 font-semibold">👍 {rec.votes} votes</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-[theme(--color-text-muted)]">
                    <div className="text-6xl mb-4">💡</div>
                    <p className="text-lg font-semibold">No recommendations available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimeDetailPage;
