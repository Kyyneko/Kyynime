import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { searchAnime, searchManga, searchCharacters, searchPeople } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import MangaCard from '../components/MangaCard';
import CharacterCard from '../components/CharacterCard';
import PeopleCard from '../components/PeopleCard';
import ContentGrid from '../components/shared/ContentGrid';
import Pagination from '../components/shared/Pagination';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'anime';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [inputValue, setInputValue] = useState(query);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', type, query, page],
    queryFn: () => {
      if (type === 'manga') return searchManga(query, page);
      if (type === 'characters') return searchCharacters(query, page);
      if (type === 'people') return searchPeople(query, page);
      return searchAnime(query, page);
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const results = data?.data || [];
  const pagination = data?.pagination;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setSearchParams({ q: inputValue.trim(), type, page: '1' });
  };

  const handleTypeChange = (newType) => {
    setSearchParams({ q: query, type: newType, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, type, page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const types = [
    { id: 'anime', icon: '🎬', label: 'Anime' },
    { id: 'manga', icon: '📖', label: 'Manga' },
    { id: 'characters', icon: '👥', label: 'Characters' },
    { id: 'people', icon: '🎭', label: 'People' },
  ];

  const getDetailPath = (item) => {
    if (type === 'manga') return `/manga/${item.mal_id}`;
    if (type === 'characters') return `/characters/${item.mal_id}`;
    if (type === 'people') return `/people/${item.mal_id}`;
    return `/anime/${item.mal_id}`;
  };

  const renderCard = (item) => {
    const link = getDetailPath(item);
    if (type === 'manga') return <Link key={item.mal_id} to={link}><MangaCard manga={item} onClick={() => {}} /></Link>;
    if (type === 'characters') return <Link key={item.mal_id} to={link}><CharacterCard character={item} onClick={() => {}} /></Link>;
    if (type === 'people') return <Link key={item.mal_id} to={link}><PeopleCard person={item} /></Link>;
    return <Link key={item.mal_id} to={link}><AnimeCard anime={item} onClick={() => {}} /></Link>;
  };

  return (
    <>
      <Helmet>
        <title>{query ? `Search: "${query}"` : 'Search'} — Kyynime</title>
        <meta name="description" content={`Search anime, manga, characters, and people on Kyynime.`} />
      </Helmet>

      <div className="animate-fade-in">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search anime, manga, characters, people..."
              className="w-full px-6 py-4 bg-[theme(--color-dark-card)] border-2 border-[theme(--color-border)] rounded-2xl text-white placeholder-[theme(--color-text-muted)] focus:border-[theme(--color-primary)] focus:outline-none focus:shadow-lg focus:shadow-[theme(--color-primary)]/20 transition-all text-lg font-medium"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white font-bold rounded-xl hover:shadow-lg transition-all">
              🔍 Search
            </button>
          </div>
        </form>

        {/* Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => handleTypeChange(t.id)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                type === t.id
                  ? 'bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white shadow-lg shadow-[theme(--color-primary)]/50'
                  : 'bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {query ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-1">
                🔍 Results for "<span className="text-[theme(--color-primary)]">{query}</span>"
              </h2>
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-block w-2 h-2 bg-[theme(--color-primary)] rounded-full animate-ping" />
                  <span className="text-[theme(--color-text-muted)] font-medium">Searching...</span>
                </div>
              ) : !error && (
                <p className="text-[theme(--color-text-secondary)] text-sm"><span className="text-white font-bold">{results.length}</span> {type} found</p>
              )}
            </div>
            <ContentGrid
              data={results}
              isLoading={isLoading}
              error={error?.message || (error ? 'Search failed.' : null)}
              onRetry={refetch}
              emptyTitle="No Results Found"
              emptyMessage={`No ${type} found for "${query}". Try different keywords.`}
              renderCard={renderCard}
            />
            <Pagination currentPage={page} lastPage={pagination?.last_visible_page || 1} onPageChange={handlePageChange} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-black text-white mb-2">Start Searching</h3>
            <p className="text-[theme(--color-text-secondary)] text-lg">Enter a query above to find anime, manga, characters, and people</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
