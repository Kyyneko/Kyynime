import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getTopPeople, searchPeople } from '../services/api';
import PeopleCard from '../components/PeopleCard';
import SearchBar from '../components/SearchBar';
import ContentGrid from '../components/shared/ContentGrid';
import PageHeader from '../components/shared/PageHeader';
import Pagination from '../components/shared/Pagination';
import { Helmet } from 'react-helmet-async';

const PeoplePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';
  const isSearch = searchQuery.length > 0;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [isSearch ? 'searchPeople' : 'topPeople', isSearch ? searchQuery : null, page],
    queryFn: () => isSearch ? searchPeople(searchQuery, page) : getTopPeople(page),
    staleTime: 5 * 60 * 1000,
  });

  const peopleList = data?.data || [];
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
        <title>{isSearch ? `Search: "${searchQuery}"` : 'Voice Actors & Staff'} — Kyynime</title>
        <meta name="description" content="Discover voice actors, directors, and anime staff. Explore their profiles and anime credits on Kyynime." />
      </Helmet>

      <div className="mb-8 animate-fade-in">
        <SearchBar onSearch={handleSearch} placeholder="Search voice actors, directors..." />
      </div>

      <PageHeader
        icon={isSearch ? '🔍' : '🎭'}
        title={isSearch ? `Search: "${searchQuery}"` : 'Voice Actors & Staff'}
        count={!isLoading && !error ? peopleList.length : undefined}
        countLabel="people found"
      />

      <ContentGrid
        data={peopleList}
        isLoading={isLoading}
        error={error?.message || (error ? 'Failed to load people.' : null)}
        onRetry={refetch}
        emptyTitle="No People Found"
        emptyMessage="Try searching with different keywords"
        renderCard={(person) => (
          <Link key={person.mal_id} to={`/people/${person.mal_id}`}>
            <PeopleCard person={person} />
          </Link>
        )}
      />

      <Pagination currentPage={page} lastPage={pagination?.last_visible_page || 1} onPageChange={handlePageChange} />
    </>
  );
};

export default PeoplePage;
