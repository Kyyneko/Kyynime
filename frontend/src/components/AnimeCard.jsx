import React from 'react';

const AnimeCard = ({ anime, onClick }) => {
    return (
        <div
            onClick={() => onClick(anime.mal_id)}
            className="group relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border"
            style={{
                backgroundColor: 'var(--color-dark-card)',
                borderColor: 'var(--color-border)',
                boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = '0 0 0 0 rgba(59, 130, 246, 0.4)';
            }}
        >
            {/* Image Container */}
            <div 
                className="relative aspect-[2/3] overflow-hidden"
                style={{ backgroundColor: 'var(--color-dark-light)' }}
            >
                <img
                    src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                {/* Score Badge - Top Right */}
                {anime.score && (
                    <div className="absolute top-3 right-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-2.5 py-1 rounded-lg font-black text-sm shadow-xl flex items-center gap-1">
                        <span>⭐</span>
                        <span>{anime.score}</span>
                    </div>
                )}

                {/* Rank Badge - Top Left (only for top 100) */}
                {anime.rank && anime.rank <= 100 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-br from-purple-600 to-pink-600 text-white w-10 h-10 rounded-full font-black text-sm shadow-xl flex items-center justify-center border-2 border-white/30">
                        #{anime.rank}
                    </div>
                )}

                {/* Type & Episodes - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center justify-between text-xs">
                        <span 
                            className="text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wide"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            {anime.type || 'TV'}
                        </span>
                        {anime.episodes && (
                            <span className="text-white font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
                                {anime.episodes} eps
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Badge - Airing Indicator */}
                {anime.status === 'Currently Airing' && (
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            <span>AIRING</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Container */}
            <div className="p-3 space-y-2">
                {/* Title */}
                <h3 
                    className="text-white font-bold text-sm leading-snug line-clamp-2 min-h-[2.5rem] transition-colors duration-200 group-hover:text-[var(--color-primary)]"
                >
                    {anime.title}
                </h3>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs">
                    {anime.year && (
                        <span 
                            className="font-semibold"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {anime.year}
                        </span>
                    )}
                    {anime.status && anime.status !== 'Currently Airing' && (
                        <span 
                            className="font-bold"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            ✓ Finished
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimeCard;