import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getTopAnime, getSeasonalAnime, searchAnime } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import SearchBar from '../components/SearchBar';
import ContentGrid from '../components/shared/ContentGrid';
import PageHeader from '../components/shared/PageHeader';
import Pagination from '../components/shared/Pagination';
import { Helmet } from 'react-helmet-async';

const AnimePage = ({ mode = 'top' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';

  const currentMode = searchQuery ? 'search' : mode;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [currentMode === 'search' ? 'searchAnime' : currentMode === 'seasonal' ? 'seasonalAnime' : 'topAnime', currentMode === 'search' ? searchQuery : null, page],
    queryFn: () => {
      if (currentMode === 'search') return searchAnime(searchQuery, page);
      if (currentMode === 'seasonal') return getSeasonalAnime(page);
      return getTopAnime(page);
    },
    staleTime: 5 * 60 * 1000,
    enabled: currentMode !== 'search' || searchQuery.length > 0,
  });

  const animeList = data?.data || [];
  const pagination = data?.pagination;

  const handleSearch = (query) => {
    if (!query.trim()) return;
    setSearchParams({ q: query, page: '1' });
  };

  const handlePageChange = (newPage) => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    params.page = String(newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTitle = () => {
    if (currentMode === 'search') return `Search: "${searchQuery}"`;
    if (currentMode === 'seasonal') return 'This Season';
    return 'Top Anime';
  };

  const getIcon = () => {
    if (currentMode === 'search') return '🔍';
    if (currentMode === 'seasonal') return '📅';
    return '⭐';
  };

  return (
    <>
      <Helmet>
        <title>{getTitle()} — Kyynime</title>
        <meta name="description" content={`Browse ${getTitle().toLowerCase()} on Kyynime.`} />
      </Helmet>

      <div className="mb-8 animate-fade-in">
        <SearchBar onSearch={handleSearch} placeholder="Search anime..." />
      </div>

      {!searchQuery && (
        <div className="flex gap-2 mb-6 animate-fade-in">
          <Link to="/anime" className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${mode === 'top' ? 'bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white shadow-lg shadow-[theme(--color-primary)]/50' : 'bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:text-white'}`}>
            ⭐ Top Anime
          </Link>
          <Link to="/anime/seasonal" className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${mode === 'seasonal' ? 'bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white shadow-lg shadow-[theme(--color-primary)]/50' : 'bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:text-white'}`}>
            📅 Seasonal
          </Link>
        </div>
      )}

      <PageHeader icon={getIcon()} title={getTitle()} count={!isLoading && !error ? animeList.length : undefined} countLabel="anime found" isLoading={isLoading} />

      <ContentGrid
        data={animeList}
        isLoading={isLoading}
        error={error?.message || (error ? 'Failed to load anime.' : null)}
        onRetry={refetch}
        emptyTitle="No Anime Found"
        emptyMessage="Try searching with different keywords"
        renderCard={(anime) => (
          <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`}>
            <AnimeCard anime={anime} onClick={() => {}} />
          </Link>
        )}
      />

      <Pagination currentPage={page} lastPage={pagination?.last_visible_page || 1} onPageChange={handlePageChange} />
    </>
  );
};

export default AnimePage;
