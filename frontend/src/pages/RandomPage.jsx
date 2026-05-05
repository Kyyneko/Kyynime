import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getRandomAnime, getRandomManga, getRandomCharacter } from '../services/api';
import { SkeletonRandom } from '../components/shared/SkeletonCard';

const RandomPage = () => {
  const [category, setCategory] = useState('anime');
  const [spinKey, setSpinKey] = useState(0);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['random', category, spinKey],
    queryFn: () => {
      if (category === 'manga') return getRandomManga();
      if (category === 'character') return getRandomCharacter();
      return getRandomAnime();
    },
    staleTime: 0,
    cacheTime: 0,
  });

  const item = data?.data;
  const isSpinning = isLoading || isFetching;

  const handleSpin = () => {
    setSpinKey(prev => prev + 1);
  };

  const getDetailLink = () => {
    if (!item) return '#';
    if (category === 'anime') return `/anime/${item.mal_id}`;
    if (category === 'manga') return `/manga/${item.mal_id}`;
    return `/characters/${item.mal_id}`;
  };

  const getImage = () => {
    if (!item) return '';
    return item.images?.jpg?.large_image_url || item.images?.jpg?.image_url;
  };

  const categories = [
    { id: 'anime', icon: '', label: 'Anime' },
    { id: 'manga', icon: '', label: 'Manga' },
    { id: 'character', icon: '', label: 'Character' },
  ];

  return (
    <>
      <Helmet>
        <title>Random Discovery — Kyynime</title>
        <meta name="description" content="Discover random anime, manga, and characters. Feeling lucky? Spin the wheel!" />
      </Helmet>

      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce"></div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] bg-clip-text text-transparent mb-2">
            Random Discovery
          </h1>
          <p className="text-[theme(--color-text-secondary)] text-lg">Feeling lucky? Spin and discover something new!</p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setSpinKey(prev => prev + 1); }}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                category === cat.id
                  ? 'bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white shadow-lg shadow-[theme(--color-primary)]/50'
                  : 'bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:text-white'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* Result Card */}
        {/* Result Card */}
        {isSpinning ? (
          <SkeletonRandom />
        ) : item ? (
          <div className="bg-[theme(--color-dark-card)] rounded-2xl border border-[theme(--color-border)] overflow-hidden shadow-2xl animate-scale-in">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/3">
                <img src={getImage()} alt={item.title || item.name} className="w-full h-64 md:h-full object-cover" />
              </div>

              {/* Info */}
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{item.title || item.name}</h2>
                  {(item.title_japanese || item.name_kanji) && (
                    <p className="text-[theme(--color-text-muted)] mb-3">{item.title_japanese || item.name_kanji}</p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.score && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-lg text-white font-black text-sm"> {item.score}</span>
                    )}
                    {item.type && (
                      <span className="bg-[theme(--color-primary)]/20 border border-[theme(--color-primary)] text-[theme(--color-primary)] px-3 py-1 rounded-lg font-bold text-sm">{item.type}</span>
                    )}
                    {item.status && (
                      <span className="bg-emerald-500/20 border border-emerald-400 text-emerald-400 px-3 py-1 rounded-lg font-bold text-sm">{item.status}</span>
                    )}
                    {item.favorites && (
                      <span className="bg-pink-500/20 border border-pink-400 text-pink-400 px-3 py-1 rounded-lg font-bold text-sm"> {item.favorites.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Genres */}
                  {item.genres && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.genres.slice(0, 5).map(g => (
                        <span key={g.mal_id} className="bg-white/5 border border-white/10 text-white/80 px-2 py-0.5 rounded-full text-xs font-medium">{g.name}</span>
                      ))}
                    </div>
                  )}

                  {/* Synopsis/About */}
                  <p className="text-[theme(--color-text-secondary)] text-sm leading-relaxed line-clamp-4">
                    {item.synopsis || item.about || 'No description available.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link to={getDetailLink()} className="px-6 py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white font-black rounded-xl hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 transform hover:scale-105 transition-all flex items-center gap-2">
                     View Details
                  </Link>
                  <button onClick={handleSpin} className="px-6 py-3 bg-gradient-to-r from-[theme(--color-accent)] to-emerald-600 text-white font-black rounded-xl hover:shadow-2xl hover:shadow-[theme(--color-accent)]/50 transform hover:scale-105 transition-all flex items-center gap-2">
                     Spin Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[theme(--color-dark-card)] rounded-2xl border border-[theme(--color-border)] overflow-hidden shadow-2xl">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-7xl mb-6"></div>
              <p className="text-[theme(--color-text-secondary)] text-lg font-semibold">
                Click a category to start!
              </p>
            </div>
          </div>
        )}

        {/* Spin Again (Bottom) */}
        {item && !isSpinning && (
          <div className="text-center mt-8">
            <button onClick={handleSpin} className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all text-lg flex items-center gap-3 mx-auto">
              <span className="text-2xl"></span> Try Another One!
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RandomPage;
