import React, { useState, useEffect } from 'react';
import { getTopAnime, searchAnime } from '../services/api';
import AnimeCard from './AnimeCard';
import SearchBar from './SearchBar';

const AnimeSection = ({ onAnimeClick }) => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('top');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeTab === 'top') {
            loadTopAnime();
        }
    }, [activeTab]);

    const loadTopAnime = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTopAnime();
            setAnimeList(data.data || []);
        } catch (error) {
            setError('Failed to load top anime');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) return;
        setSearchQuery(query);
        setActiveTab('search');
        setLoading(true);
        setError(null);
        try {
            const data = await searchAnime(query);
            setAnimeList(data.data || []);
        } catch (error) {
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <SearchBar onSearch={handleSearch} />
            
            <div className="mb-6 mt-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl">
                        {activeTab === 'search' ? '🔍' : '⭐'}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] bg-clip-text text-transparent">
                        {activeTab === 'search' ? `Search: "${searchQuery}"` : 'Top Anime'}
                    </h2>
                </div>
                
                {!error && !loading && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="inline-block w-2 h-2 bg-[theme(--color-accent)] rounded-full animate-pulse"></span>
                        <span className="text-[theme(--color-text-secondary)] font-medium">
                            <span className="text-white font-bold">{animeList.length}</span> anime found
                        </span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[theme(--color-primary)]"></div>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                    {animeList.map((anime) => (
                        <AnimeCard key={anime.mal_id} anime={anime} onClick={onAnimeClick} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnimeSection;
