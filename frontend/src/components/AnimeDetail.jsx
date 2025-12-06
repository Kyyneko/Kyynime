import React, { useState, useEffect } from 'react';
import { 
    getAnimeFull, 
    getAnimeCharacters, 
    getAnimeVideos,
    getAnimeStatistics,
    getAnimeRecommendations,
    getAnimeStreaming,
    getAnimeThemes
} from '../services/api';

const AnimeDetail = ({ animeId, onClose }) => {
    const [anime, setAnime] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [videos, setVideos] = useState(null);
    const [stats, setStats] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [streaming, setStreaming] = useState([]);
    const [themes, setThemes] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnimeData();
    }, [animeId]);

    const loadAnimeData = async () => {
        setLoading(true);
        try {
            const [animeData, charData, videoData, statsData, recData, streamData, themeData] = await Promise.all([
                getAnimeFull(animeId),
                getAnimeCharacters(animeId),
                getAnimeVideos(animeId),
                getAnimeStatistics(animeId),
                getAnimeRecommendations(animeId),
                getAnimeStreaming(animeId),
                getAnimeThemes(animeId)
            ]);
            
            setAnime(animeData.data);
            setCharacters(charData.data.slice(0, 12));
            setVideos(videoData.data);
            setStats(statsData.data);
            setRecommendations(recData.data.slice(0, 6));
            setStreaming(streamData.data);
            setThemes(themeData.data);
        } catch (error) {
            console.error('Error loading anime data:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="loading-screen">Loading anime details...</div>;
    }

    if (!anime) {
        return <div className="error-screen">Failed to load anime</div>;
    }

    return (
        <div className="anime-detail-overlay">
            <div className="anime-detail-container">
                <button className="close-button" onClick={onClose}>✕</button>
                
                {/* Header */}
                <div className="anime-header" style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${anime.images.jpg.large_image_url})`
                }}>
                    <div className="anime-header-content">
                        <img src={anime.images.jpg.large_image_url} alt={anime.title} className="anime-poster" />
                        <div className="anime-header-info">
                            <h1>{anime.title}</h1>
                            <p className="anime-title-japanese">{anime.title_japanese}</p>
                            <div className="anime-meta">
                                <span className="meta-badge score">⭐ {anime.score}</span>
                                <span className="meta-badge">{anime.type}</span>
                                <span className="meta-badge">{anime.status}</span>
                                <span className="meta-badge">{anime.episodes} Episodes</span>
                                <span className="meta-badge">#{anime.rank}</span>
                            </div>
                            <div className="anime-genres">
                                {anime.genres.map(genre => (
                                    <span key={genre.mal_id} className="genre-tag">{genre.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button className={activeTab === 'overview' ? 'tab active' : 'tab'} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button className={activeTab === 'characters' ? 'tab active' : 'tab'} onClick={() => setActiveTab('characters')}>Characters</button>
                    <button className={activeTab === 'videos' ? 'tab active' : 'tab'} onClick={() => setActiveTab('videos')}>Videos</button>
                    <button className={activeTab === 'stats' ? 'tab active' : 'tab'} onClick={() => setActiveTab('stats')}>Statistics</button>
                    <button className={activeTab === 'recommendations' ? 'tab active' : 'tab'} onClick={() => setActiveTab('recommendations')}>Recommendations</button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <div className="section">
                                <h2>Synopsis</h2>
                                <p>{anime.synopsis}</p>
                            </div>
                            
                            {anime.background && (
                                <div className="section">
                                    <h2>Background</h2>
                                    <p>{anime.background}</p>
                                </div>
                            )}

                            <div className="section">
                                <h2>Information</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <strong>Aired:</strong> {anime.aired.string}
                                    </div>
                                    <div className="info-item">
                                        <strong>Duration:</strong> {anime.duration}
                                    </div>
                                    <div className="info-item">
                                        <strong>Rating:</strong> {anime.rating}
                                    </div>
                                    <div className="info-item">
                                        <strong>Studios:</strong> {anime.studios.map(s => s.name).join(', ')}
                                    </div>
                                    <div className="info-item">
                                        <strong>Source:</strong> {anime.source}
                                    </div>
                                    <div className="info-item">
                                        <strong>Season:</strong> {anime.season} {anime.year}
                                    </div>
                                </div>
                            </div>

                            {themes && (themes.openings.length > 0 || themes.endings.length > 0) && (
                                <div className="section">
                                    <h2>Theme Songs</h2>
                                    {themes.openings.length > 0 && (
                                        <div>
                                            <h3>Openings</h3>
                                            <ul className="theme-list">
                                                {themes.openings.map((op, idx) => (
                                                    <li key={idx}>{op}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {themes.endings.length > 0 && (
                                        <div>
                                            <h3>Endings</h3>
                                            <ul className="theme-list">
                                                {themes.endings.map((ed, idx) => (
                                                    <li key={idx}>{ed}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {streaming && streaming.length > 0 && (
                                <div className="section">
                                    <h2>Where to Watch</h2>
                                    <div className="streaming-links">
                                        {streaming.map((stream, idx) => (
                                            <a key={idx} href={stream.url} target="_blank" rel="noopener noreferrer" className="streaming-link">
                                                {stream.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'characters' && (
                        <div className="characters-tab">
                            <div className="characters-grid">
                                {characters.map(char => (
                                    <div key={char.character.mal_id} className="character-card">
                                        <img src={char.character.images.jpg.image_url} alt={char.character.name} />
                                        <div className="character-info">
                                            <h4>{char.character.name}</h4>
                                            <p>{char.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'videos' && videos && (
                        <div className="videos-tab">
                            {videos.promo && videos.promo.length > 0 && (
                                <div className="section">
                                    <h2>Promotional Videos</h2>
                                    <div className="videos-grid">
                                        {videos.promo.map((video, idx) => (
                                            <div key={idx} className="video-card">
                                                <iframe
                                                    src={video.trailer.embed_url}
                                                    title={video.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                                <p>{video.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'stats' && stats && (
                        <div className="stats-tab">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>Watching</h3>
                                    <p className="stat-number">{stats.watching.toLocaleString()}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Completed</h3>
                                    <p className="stat-number">{stats.completed.toLocaleString()}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>On Hold</h3>
                                    <p className="stat-number">{stats.on_hold.toLocaleString()}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Dropped</h3>
                                    <p className="stat-number">{stats.dropped.toLocaleString()}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Plan to Watch</h3>
                                    <p className="stat-number">{stats.plan_to_watch.toLocaleString()}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Total</h3>
                                    <p className="stat-number">{stats.total.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="score-distribution">
                                <h3>Score Distribution</h3>
                                {stats.scores.map(score => (
                                    <div key={score.score} className="score-bar">
                                        <span className="score-label">{score.score}</span>
                                        <div className="score-bar-fill" style={{width: `${(score.votes / stats.total) * 100}%`}}></div>
                                        <span className="score-votes">{score.votes.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'recommendations' && (
                        <div className="recommendations-tab">
                            <div className="recommendations-grid">
                                {recommendations.map(rec => (
                                    <div key={rec.entry.mal_id} className="recommendation-card" onClick={() => { setAnime(null); loadAnimeData(); }}>
                                        <img src={rec.entry.images.jpg.image_url} alt={rec.entry.title} />
                                        <h4>{rec.entry.title}</h4>
                                        <p>{rec.votes} votes</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimeDetail;
