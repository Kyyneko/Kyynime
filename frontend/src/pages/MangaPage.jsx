import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getTopManga, searchManga } from '../services/api';
import MangaCard from '../components/MangaCard';
import SearchBar from '../components/SearchBar';
import ContentGrid from '../components/shared/ContentGrid';
import PageHeader from '../components/shared/PageHeader';
import Pagination from '../components/shared/Pagination';
import { Helmet } from 'react-helmet-async';

const MangaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';
  const isSearch = searchQuery.length > 0;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [isSearch ? 'searchManga' : 'topManga', isSearch ? searchQuery : null, page],
    queryFn: () => isSearch ? searchManga(searchQuery, page) : getTopManga(page),
    staleTime: 5 * 60 * 1000,
  });

  const mangaList = data?.data || [];
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
        <title>{isSearch ? `Search: "${searchQuery}"` : 'Top Manga'} — Kyynime</title>
        <meta name="description" content="Discover top manga titles, search your favorites, and explore detailed manga information on Kyynime." />
      </Helmet>

      <div className="mb-8 animate-fade-in">
        <SearchBar onSearch={handleSearch} placeholder="Search your favorite manga..." />
      </div>

      <PageHeader
        icon={isSearch ? '🔍' : '📖'}
        title={isSearch ? `Search: "${searchQuery}"` : 'Top Manga'}
        count={!isLoading && !error ? mangaList.length : undefined}
        countLabel="manga found"
      />

      <ContentGrid
        data={mangaList}
        isLoading={isLoading}
        error={error?.message || (error ? 'Failed to load manga.' : null)}
        onRetry={refetch}
        emptyTitle="No Manga Found"
        emptyMessage="Try searching with different keywords"
        renderCard={(manga) => (
          <Link key={manga.mal_id} to={`/manga/${manga.mal_id}`}>
            <MangaCard manga={manga} onClick={() => {}} />
          </Link>
        )}
      />

      <Pagination currentPage={page} lastPage={pagination?.last_visible_page || 1} onPageChange={handlePageChange} />
    </>
  );
};

export default MangaPage;
