import React, { useState, useEffect } from 'react';
import { getTopCharacters, searchCharacters } from '../services/api';
import CharacterCard from './CharacterCard';
import SearchBar from './SearchBar';

const CharactersSection = ({ onCharacterClick }) => {
    const [characterList, setCharacterList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('top');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeTab === 'top') {
            loadTopCharacters();
        }
    }, [activeTab]);

    const loadTopCharacters = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTopCharacters();
            setCharacterList(data.data || []);
        } catch (error) {
            console.error('Error loading top characters:', error);
            setError('Failed to load top characters. Please try again later.');
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
            const data = await searchCharacters(query);
            setCharacterList(data.data || []);
            if (!data.data || data.data.length === 0) {
                setError(`No characters found for "${query}"`);
            }
        } catch (error) {
            console.error('Error searching characters:', error);
            setError('Failed to search characters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        if (activeTab === 'top') {
            loadTopCharacters();
        } else if (activeTab === 'search' && searchQuery) {
            handleSearch(searchQuery);
        }
    };

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-8 animate-fade-in">
                <SearchBar onSearch={handleSearch} placeholder="Search characters... (e.g., Luffy, Naruto)" />
            </div>

            {/* Header */}
            <div className="mb-6 animate-slide-up">
                <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl">
                        {activeTab === 'search' ? '🔍' : '👥'}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] bg-clip-text text-transparent">
                        {activeTab === 'search' ? `Search: "${searchQuery}"` : 'Top Characters'}
                    </h2>
                </div>
                
                {!error && !loading && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="inline-block w-2 h-2 bg-[theme(--color-accent)] rounded-full animate-pulse"></span>
                        <span className="text-[theme(--color-text-secondary)] font-medium">
                            <span className="text-white font-bold">{characterList.length}</span> characters found
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <div className="relative mb-8">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-[theme(--color-primary)]"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="text-4xl">👥</div>
                        </div>
                    </div>
                    <p className="text-[theme(--color-text-secondary)] text-xl font-semibold">Loading characters...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
                    <div className="text-8xl mb-6">😔</div>
                    <h3 className="text-3xl font-black text-white mb-4">Oops! Something went wrong</h3>
                    <p className="text-[theme(--color-text-secondary)] mb-8 text-center max-w-md text-lg">{error}</p>
                    <button 
                        onClick={handleRetry}
                        className="px-10 py-4 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
                    >
                        <span className="text-2xl">🔄</span>
                        <span>Try Again</span>
                    </button>
                </div>
            ) : characterList.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
                    <div className="text-8xl mb-6">🔍</div>
                    <h3 className="text-3xl font-black text-white mb-4">No Characters Found</h3>
                    <p className="text-[theme(--color-text-secondary)] text-center max-w-md text-lg">
                        Try searching with different keywords
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 animate-scale-in">
                    {characterList.map((character) => (
                        <CharacterCard
                            key={character.mal_id}
                            character={character}
                            onClick={onCharacterClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CharactersSection;
