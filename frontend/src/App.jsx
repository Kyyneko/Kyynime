import React, { useState, useEffect } from 'react';
import { searchAnime, getTopAnime, getSeasonalAnime } from './services/api';
import AnimeCard from './components/AnimeCard';
import SearchBar from './components/SearchBar';
import AnimeDetail from './components/AnimeDetail';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    const [animeList, setAnimeList] = useState([]);
    const [selectedAnimeId, setSelectedAnimeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('top');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeView === 'top') {
            loadTopAnime();
        } else if (activeView === 'seasonal') {
            loadSeasonalAnime();
        }
    }, [activeView]);

    const loadTopAnime = async () => {
        setLoading(true);
        try {
            const data = await getTopAnime();
            setAnimeList(data.data);
        } catch (error) {
            console.error('Error loading top anime:', error);
        }
        setLoading(false);
    };

    const loadSeasonalAnime = async () => {
        setLoading(true);
        try {
            const data = await getSeasonalAnime();
            setAnimeList(data.data);
        } catch (error) {
            console.error('Error loading seasonal anime:', error);
        }
        setLoading(false);
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setActiveView('search');
        setLoading(true);
        try {
            const data = await searchAnime(query);
            setAnimeList(data.data);
        } catch (error) {
            console.error('Error searching anime:', error);
        }
        setLoading(false);
    };

    const handleAnimeClick = (id) => {
        setSelectedAnimeId(id);
    };

    const handleCloseDetail = () => {
        setSelectedAnimeId(null);
    };

    const handleViewChange = (view) => {
        setActiveView(view);
        setSearchQuery('');
    };

    return (
        <div className="App">
            <Navbar activeView={activeView} onViewChange={handleViewChange} />
            
            <div className="container">
                <div className="search-section">
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div className="content-header">
                    <h2>
                        {activeView === 'search' && `Search Results: "${searchQuery}"`}
                        {activeView === 'top' && 'Top Anime'}
                        {activeView === 'seasonal' && 'This Season'}
                    </h2>
                    <p className="result-count">{animeList.length} anime found</p>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading anime...</p>
                    </div>
                ) : (
                    <div className="anime-grid">
                        {animeList.map((anime) => (
                            <AnimeCard
                                key={anime.mal_id}
                                anime={anime}
                                onClick={handleAnimeClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedAnimeId && (
                <AnimeDetail animeId={selectedAnimeId} onClose={handleCloseDetail} />
            )}
        </div>
    );
}

export default App;
