import React from 'react';

const CharacterCard = ({ character, onClick }) => {
    return (
        <div
            onClick={() => onClick(character.mal_id)}
            className="group relative bg-[theme(--color-dark-card)] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[theme(--color-primary)]/40 border border-[theme(--color-border)] hover:border-[theme(--color-primary)]"
        >
            {/* Image Container */}
            <div className="relative aspect-[2/3] overflow-hidden bg-[theme(--color-dark-light)]">
                <img
                    src={character.images?.jpg?.image_url || character.images?.webp?.image_url}
                    alt={character.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                {/* Favorites Badge */}
                {character.favorites && (
                    <div className="absolute top-3 right-3 bg-gradient-to-br from-pink-500 to-red-500 text-white px-2.5 py-1 rounded-lg font-black text-sm shadow-xl flex items-center gap-1">
                        <span>❤️</span>
                        <span>{character.favorites.toLocaleString()}</span>
                    </div>
                )}

                {/* Nickname/Kanji */}
                {character.name_kanji && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                        <p className="text-white text-xs font-semibold truncate">
                            {character.name_kanji}
                        </p>
                    </div>
                )}
            </div>

            {/* Info Container */}
            <div className="p-3 space-y-2">
                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[theme(--color-primary)] transition-colors duration-200">
                    {character.name}
                </h3>
                
                {character.nicknames && character.nicknames.length > 0 && (
                    <p className="text-[theme(--color-text-muted)] text-xs truncate">
                        "{character.nicknames[0]}"
                    </p>
                )}
            </div>
        </div>
    );
};

export default CharacterCard;
