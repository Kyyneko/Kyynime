import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTopAnime, getSeasonalAnime, getTopManga, getTopCharacters } from '../services/api';
import HorizontalScroll from '../components/shared/HorizontalScroll';
import { Helmet } from 'react-helmet-async';

/* ---------- Mini Card for Horizontal Scroll ---------- */
const MiniAnimeCard = ({ anime }) => (
  <Link to={`/anime/${anime.mal_id}`} className="block group">
    <div className="rounded-xl overflow-hidden border border-[theme(--color-border)] bg-[theme(--color-dark-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[theme(--color-primary)]">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {anime.score && (
          <div className="absolute top-2 right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-md font-black text-xs flex items-center gap-0.5">
            ⭐ {anime.score}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white px-1.5 py-0.5 rounded font-bold uppercase bg-[theme(--color-primary)]">
              {anime.type || 'TV'}
            </span>
            {anime.episodes && (
              <span className="text-white font-bold bg-black/50 px-1.5 py-0.5 rounded">
                {anime.episodes} eps
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="text-white font-bold text-xs leading-snug line-clamp-2 group-hover:text-[theme(--color-primary)] transition-colors">
          {anime.title}
        </h3>
      </div>
    </div>
  </Link>
);

const MiniMangaCard = ({ manga }) => (
  <Link to={`/manga/${manga.mal_id}`} className="block group">
    <div className="rounded-xl overflow-hidden border border-[theme(--color-border)] bg-[theme(--color-dark-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[theme(--color-primary)]">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url}
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {manga.score && (
          <div className="absolute top-2 right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-md font-black text-xs flex items-center gap-0.5">
            ⭐ {manga.score}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-white font-bold text-xs leading-snug line-clamp-2 group-hover:text-[theme(--color-primary)] transition-colors">
          {manga.title}
        </h3>
      </div>
    </div>
  </Link>
);

const MiniCharCard = ({ character }) => (
  <Link to={`/characters/${character.mal_id}`} className="block group">
    <div className="rounded-xl overflow-hidden border border-[theme(--color-border)] bg-[theme(--color-dark-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[theme(--color-primary)]">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={character.images?.jpg?.image_url}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {character.favorites && (
          <div className="absolute top-2 right-2 bg-gradient-to-br from-pink-500 to-rose-600 text-white px-1.5 py-0.5 rounded-md font-black text-xs flex items-center gap-0.5">
            ❤️ {character.favorites.toLocaleString()}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-white font-bold text-xs leading-snug line-clamp-2 group-hover:text-[theme(--color-primary)] transition-colors">
          {character.name}
        </h3>
      </div>
    </div>
  </Link>
);

/* ---------- Hero Banner ---------- */
const HeroBanner = ({ anime }) => {
  if (!anime) return null;
  const bg = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <div className="relative rounded-2xl overflow-hidden mb-10 group">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-[2000ms]"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[theme(--color-dark)]/95 via-[theme(--color-dark)]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[theme(--color-dark)]/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-10 py-12 md:py-20 lg:py-24 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            🔥 #1 Trending
          </span>
          {anime.score && (
            <span className="bg-amber-500/20 border border-amber-400 text-amber-300 px-3 py-1 rounded-full text-xs font-black">
              ⭐ {anime.score}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight drop-shadow-2xl">
          {anime.title}
        </h1>
        {anime.title_japanese && (
          <p className="text-[theme(--color-text-muted)] text-sm md:text-base mb-4 font-medium">
            {anime.title_japanese}
          </p>
        )}

        <p className="text-[theme(--color-text-secondary)] text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
          {anime.synopsis}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {anime.genres?.slice(0, 4).map(genre => (
            <span
              key={genre.mal_id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/anime/${anime.mal_id}`}
            className="px-6 py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white font-black rounded-xl hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span>📖</span> View Details
          </Link>
          {anime.trailer?.url && (
            <a
              href={anime.trailer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-black rounded-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span>▶️</span> Watch Trailer
            </a>
          )}
        </div>
      </div>

      {/* Right image (desktop) */}
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-10">
        <img
          src={bg}
          alt={anime.title}
          className="w-52 h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

/* ---------- Home Page ---------- */
const HomePage = () => {
  const { data: topAnimeData, isLoading: loadingTop } = useQuery({
    queryKey: ['topAnime', 1],
    queryFn: () => getTopAnime(1),
    staleTime: 5 * 60 * 1000,
  });

  const { data: seasonalData, isLoading: loadingSeasonal } = useQuery({
    queryKey: ['seasonalAnime', 1],
    queryFn: () => getSeasonalAnime(1),
    staleTime: 5 * 60 * 1000,
  });

  const { data: topMangaData, isLoading: loadingManga } = useQuery({
    queryKey: ['topManga', 1],
    queryFn: () => getTopManga(1),
    staleTime: 5 * 60 * 1000,
  });

  const { data: topCharsData, isLoading: loadingChars } = useQuery({
    queryKey: ['topCharacters', 1],
    queryFn: () => getTopCharacters(1),
    staleTime: 5 * 60 * 1000,
  });

  const topAnime = topAnimeData?.data || [];
  const seasonal = seasonalData?.data || [];
  const topManga = topMangaData?.data || [];
  const topChars = topCharsData?.data || [];
  const heroAnime = topAnime[0];

  return (
    <>
      <Helmet>
        <title>Kyynime — Your Anime Paradise</title>
        <meta name="description" content="Discover top anime, manga, and characters. Browse seasonal anime, find recommendations, and explore the best of Japanese animation." />
        <meta property="og:title" content="Kyynime — Your Anime Paradise" />
        <meta property="og:description" content="Discover top anime, manga, and characters." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Banner */}
      {heroAnime && <HeroBanner anime={heroAnime} />}

      {/* Trending Now */}
      <HorizontalScroll
        title="Trending Anime"
        icon="🔥"
        data={topAnime.slice(0, 15)}
        isLoading={loadingTop}
        linkTo="/anime"
        linkText="View All →"
        renderCard={(anime) => <MiniAnimeCard anime={anime} />}
      />

      {/* This Season */}
      <HorizontalScroll
        title="This Season"
        icon="📅"
        data={seasonal.slice(0, 15)}
        isLoading={loadingSeasonal}
        linkTo="/anime/seasonal"
        linkText="View All →"
        renderCard={(anime) => <MiniAnimeCard anime={anime} />}
      />

      {/* Top Manga */}
      <HorizontalScroll
        title="Top Manga"
        icon="📖"
        data={topManga.slice(0, 15)}
        isLoading={loadingManga}
        linkTo="/manga"
        linkText="View All →"
        renderCard={(manga) => <MiniMangaCard manga={manga} />}
      />

      {/* Popular Characters */}
      <HorizontalScroll
        title="Popular Characters"
        icon="👥"
        data={topChars.slice(0, 15)}
        isLoading={loadingChars}
        linkTo="/characters"
        linkText="View All →"
        renderCard={(character) => <MiniCharCard character={character} />}
      />

      {/* Quick Links Footer */}
      <div className="mt-6 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/people', icon: '🎭', label: 'Voice Actors', desc: 'Explore VA profiles' },
          { to: '/random', icon: '🎲', label: 'Random Pick', desc: 'Feeling lucky?' },
          { to: '/search', icon: '🔍', label: 'Search', desc: 'Find anything' },
          { to: '/anime/seasonal', icon: '📅', label: 'Seasonal', desc: 'Currently airing' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="group bg-[theme(--color-dark-card)] border border-[theme(--color-border)] rounded-xl p-4 hover:border-[theme(--color-primary)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[theme(--color-primary)]/10"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="text-white font-bold text-sm">{item.label}</h3>
            <p className="text-[theme(--color-text-muted)] text-xs">{item.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default HomePage;
