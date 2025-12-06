import React from 'react';

const AnimeCard = ({ anime, onClick }) => {
    return (
        <div className="anime-card" onClick={() => onClick(anime.mal_id)}>
            <div className="anime-card-image">
                <img src={anime.images.jpg.image_url} alt={anime.title} />
                <div className="anime-score">
                    ⭐ {anime.score || 'N/A'}
                </div>
            </div>
            <div className="anime-card-content">
                <h3 className="anime-title">{anime.title}</h3>
                <div className="anime-info">
                    <span className="anime-type">{anime.type}</span>
                    <span className="anime-episodes">{anime.episodes || '?'} eps</span>
                </div>
                <div className="anime-year">{anime.year || 'TBA'}</div>
            </div>
        </div>
    );
};

export default AnimeCard;
