import React from 'react';

const CharacterCard = ({ character, onClick }) => {
    return (
        <div
            onClick={() => onClick(character.mal_id)}
            className="group relative bg-[#151829] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#6366f1]/40 border border-[#2d3454] hover:border-[#6366f1]"
        >
            {/* Image Container */}
            <div className="relative aspect-[2/3] overflow-hidden bg-[#1a1f3a]">
                <img
                    src={character.images?.jpg?.image_url || character.images?.webp?.image_url}
                    alt={character.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                {/* Favorites Badge */}
                {character.favorites && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-br from-pink-500 to-red-500 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-black text-xs sm:text-sm shadow-xl flex items-center gap-1">
                        <span>❤️</span>
                        <span className="hidden sm:inline">{character.favorites.toLocaleString()}</span>
                        <span className="sm:hidden">{character.favorites > 999 ? `${(character.favorites / 1000).toFixed(1)}k` : character.favorites}</span>
                    </div>
                )}

                {/* Nickname/Kanji */}
                {character.name_kanji && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/90 to-transparent">
                        <p className="text-white text-xs font-semibold truncate">
                            {character.name_kanji}
                        </p>
                    </div>
                )}
            </div>

            {/* Info Container */}
            <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
                <h3 className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-[#6366f1] transition-colors duration-200">
                    {character.name}
                </h3>
                
                {character.nicknames && character.nicknames.length > 0 && (
                    <p className="text-gray-500 text-xs truncate">
                        "{character.nicknames[0]}"
                    </p>
                )}
            </div>
        </div>
    );
};

export default CharacterCard;