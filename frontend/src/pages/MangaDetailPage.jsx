import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getMangaFull, getMangaCharacters, getMangaRecommendations, getMangaStatistics } from '../services/api';
import { SkeletonDetail } from '../components/shared/SkeletonCard';

const MangaDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: mangaData, isLoading, error } = useQuery({
    queryKey: ['mangaFull', id], queryFn: () => getMangaFull(id), staleTime: 10 * 60 * 1000,
  });
  const { data: charsData } = useQuery({
    queryKey: ['mangaChars', id], queryFn: () => getMangaCharacters(id), staleTime: 10 * 60 * 1000,
  });
  const { data: recsData } = useQuery({
    queryKey: ['mangaRecs', id], queryFn: () => getMangaRecommendations(id), staleTime: 10 * 60 * 1000,
  });
  const { data: statsData } = useQuery({
    queryKey: ['mangaStats', id], queryFn: () => getMangaStatistics(id), staleTime: 10 * 60 * 1000,
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveTab('overview'); }, [id]);

  if (isLoading) return <div className="py-8"><SkeletonDetail /></div>;

  if (error || !mangaData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
        <div className="text-8xl mb-6">😔</div>
        <h3 className="text-3xl font-black text-white mb-4">Failed to Load Manga</h3>
        <p className="text-[theme(--color-text-secondary)] mb-8 text-lg">{error?.message || 'Manga not found'}</p>
        <Link to="/manga" className="px-8 py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all">← Back to Manga</Link>
      </div>
    );
  }

  const manga = mangaData.data;
  const characters = charsData?.data?.slice(0, 12) || [];
  const recommendations = recsData?.data?.slice(0, 6) || [];
  const stats = statsData?.data;
  const mainImage = manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url;

  return (
    <>
      <Helmet>
        <title>{manga.title} — Kyynime</title>
        <meta name="description" content={manga.synopsis?.substring(0, 160) || `Details about ${manga.title}`} />
        <meta property="og:title" content={`${manga.title} — Kyynime`} />
        <meta property="og:image" content={mainImage} />
      </Helmet>

      <div className="animate-fade-in">
        <Link to="/manga" className="inline-flex items-center gap-2 text-[theme(--color-text-muted)] hover:text-white transition-colors mb-6 font-medium">← Back to Manga</Link>

        <div className="bg-[theme(--color-dark-card)] rounded-2xl shadow-2xl overflow-hidden border border-[theme(--color-border)]">
          {/* Header */}
          <div className="relative bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(10,14,39,0.85), rgba(30,39,73,0.98)), url(${mainImage})` }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                <img src={mainImage} alt={manga.title} className="w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 object-cover rounded-xl shadow-2xl border-4 border-[theme(--color-primary)]/50 mx-auto lg:mx-0" />
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white mb-2">{manga.title}</h1>
                  <p className="text-sm sm:text-base text-[theme(--color-text-muted)] mb-4">{manga.title_japanese}</p>
                  <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm">
                    {manga.score && <span className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-xl text-white font-black border-2 border-amber-400">⭐ {manga.score}</span>}
                    <span className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] border-2 border-[theme(--color-primary-light)] px-3 py-1 rounded-xl text-white font-bold">{manga.type}</span>
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-emerald-400 px-3 py-1 rounded-xl text-white font-bold">{manga.status}</span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-400 px-3 py-1 rounded-xl text-white font-bold">{manga.chapters || '?'} Ch / {manga.volumes || '?'} Vol</span>
                    {manga.rank && <span className="bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-yellow-400 px-3 py-1 rounded-xl text-white font-black">🏆 #{manga.rank}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres?.map(g => <span key={g.mal_id} className="bg-[theme(--color-primary)]/30 border-2 border-[theme(--color-primary)] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">{g.name}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-[theme(--color-border)] px-2 sm:px-4 lg:px-8 overflow-x-auto bg-[theme(--color-dark-light)]">
            {['overview', 'characters', 'stats', 'recommendations'].map(tab => (
              <button key={tab} className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-black capitalize transition-all whitespace-nowrap text-xs sm:text-sm lg:text-base ${activeTab === tab ? 'text-white bg-gradient-to-b from-[theme(--color-primary)] to-[theme(--color-primary-dark)] border-b-4 border-[theme(--color-primary-light)] shadow-lg' : 'text-[theme(--color-text-muted)] hover:text-white hover:bg-[theme(--color-dark-card)] border-b-4 border-transparent'}`} onClick={() => setActiveTab(tab)}>
                {tab === 'overview' && '📖 '}{tab === 'characters' && '👥 '}{tab === 'stats' && '📊 '}{tab === 'recommendations' && '💡 '}{tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">📖 Synopsis</h2>
                  <div className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl">
                    <p className="text-sm sm:text-base text-white leading-relaxed">{manga.synopsis || 'No synopsis available.'}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">📊 Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Published', value: manga.published?.string },
                      { label: 'Chapters', value: manga.chapters || 'Ongoing' },
                      { label: 'Volumes', value: manga.volumes || 'Ongoing' },
                      { label: 'Authors', value: manga.authors?.map(a => a.name).join(', ') },
                      { label: 'Serializations', value: manga.serializations?.map(s => s.name).join(', ') },
                      { label: 'Members', value: manga.members?.toLocaleString() },
                    ].map(info => (
                      <div key={info.label} className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] hover:border-[theme(--color-primary)] p-3 sm:p-4 rounded-xl transition-all">
                        <strong className="text-[theme(--color-primary)] font-bold text-xs sm:text-sm">{info.label}:</strong>
                        <span className="text-white ml-2 font-medium text-xs sm:text-sm">{info.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              characters.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {characters.map(char => (
                    <Link key={char.character.mal_id} to={`/characters/${char.character.mal_id}`} className="bg-gradient-to-b from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] transition-all">
                      <img src={char.character.images.jpg.image_url} alt={char.character.name} className="w-full h-32 sm:h-40 lg:h-48 object-cover" />
                      <div className="p-2 sm:p-3">
                        <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-2">{char.character.name}</h4>
                        <p className="text-[theme(--color-primary)] text-xs mt-1 font-semibold">{char.role}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-[theme(--color-text-muted)]"><div className="text-6xl mb-4">👥</div><p className="text-lg font-semibold">No characters available</p></div>
              )
            )}

            {activeTab === 'stats' && stats && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: 'Reading', value: stats.reading },
                  { label: 'Completed', value: stats.completed },
                  { label: 'On Hold', value: stats.on_hold },
                  { label: 'Dropped', value: stats.dropped },
                  { label: 'Plan to Read', value: stats.plan_to_read },
                  { label: 'Total', value: stats.total },
                ].map(s => (
                  <div key={s.label} className="bg-gradient-to-br from-[theme(--color-dark-light)] to-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] p-4 sm:p-6 rounded-xl text-center hover:border-[theme(--color-primary)] transition-all">
                    <h3 className="text-[theme(--color-primary-light)] font-black mb-2 text-xs uppercase tracking-widest">{s.label}</h3>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">{s.value?.toLocaleString() || 0}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recommendations' && (
              recommendations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {recommendations.map(rec => (
                    <Link key={rec.entry.mal_id} to={`/manga/${rec.entry.mal_id}`} className="bg-[theme(--color-dark-light)] border border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] transition-all">
                      <img src={rec.entry.images.jpg.image_url} alt={rec.entry.title} className="w-full h-40 sm:h-48 object-cover" />
                      <div className="p-2 sm:p-3">
                        <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-2">{rec.entry.title}</h4>
                        <p className="text-[theme(--color-primary)] text-xs mt-1 font-semibold">👍 {rec.votes} votes</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-[theme(--color-text-muted)]"><div className="text-6xl mb-4">💡</div><p className="text-lg font-semibold">No recommendations available</p></div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MangaDetailPage;
