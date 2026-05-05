import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getTopCharacters, searchCharacters } from '../services/api';
import CharacterCard from '../components/CharacterCard';
import SearchBar from '../components/SearchBar';
import ContentGrid from '../components/shared/ContentGrid';
import PageHeader from '../components/shared/PageHeader';
import Pagination from '../components/shared/Pagination';
import { Helmet } from 'react-helmet-async';

const CharacterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';
  const isSearch = searchQuery.length > 0;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [isSearch ? 'searchChars' : 'topChars', isSearch ? searchQuery : null, page],
    queryFn: () => isSearch ? searchCharacters(searchQuery, page) : getTopCharacters(page),
    staleTime: 5 * 60 * 1000,
  });

  const charList = data?.data || [];
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

  return (
    <>
      <Helmet>
        <title>{isSearch ? `Search: "${searchQuery}"` : 'Top Characters'} — Kyynime</title>
        <meta name="description" content="Explore popular anime characters, search your favorites, and discover character details on Kyynime." />
      </Helmet>

      <div className="mb-8 animate-fade-in">
        <SearchBar onSearch={handleSearch} placeholder="Search characters... (e.g., Luffy, Naruto)" />
      </div>

      <PageHeader
        icon={isSearch ? '🔍' : '👥'}
        title={isSearch ? `Search: "${searchQuery}"` : 'Top Characters'}
        count={!isLoading && !error ? charList.length : undefined}
        countLabel="characters found"
        isLoading={isLoading}
      />

      <ContentGrid
        data={charList}
        isLoading={isLoading}
        error={error?.message || (error ? 'Failed to load characters.' : null)}
        onRetry={refetch}
        emptyTitle="No Characters Found"
        emptyMessage="Try searching with different keywords"
        renderCard={(character) => (
          <Link key={character.mal_id} to={`/characters/${character.mal_id}`}>
            <CharacterCard character={character} onClick={() => {}} />
          </Link>
        )}
      />

      <Pagination currentPage={page} lastPage={pagination?.last_visible_page || 1} onPageChange={handlePageChange} />
    </>
  );
};

export default CharacterPage;
