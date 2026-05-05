import React from 'react';
import { Link } from 'react-router-dom';

const PeopleCard = ({ person, onClick }) => {
  const image = person.images?.jpg?.image_url;

  return (
    <div
      onClick={() => onClick && onClick(person.mal_id)}
      className="group relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-[theme(--color-border)] bg-[theme(--color-dark-card)] hover:border-[theme(--color-primary)] hover:shadow-[theme(--color-primary)]/20"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[theme(--color-dark-light)]">
        <img
          src={image}
          alt={person.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {person.favorites && (
          <div className="absolute top-3 right-3 bg-gradient-to-br from-pink-500 to-rose-600 text-white px-2.5 py-1 rounded-lg font-black text-xs shadow-xl flex items-center gap-1">
            <span>❤️</span>
            <span>{person.favorites.toLocaleString()}</span>
          </div>
        )}

        {person.birthday && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
            <span className="text-white/80 text-xs font-medium">
              🎂 {new Date(person.birthday).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 min-h-[2.5rem] transition-colors duration-200 group-hover:text-[theme(--color-primary)]">
          {person.name}
        </h3>
        {person.given_name && (
          <p className="text-[theme(--color-text-muted)] text-xs truncate">{person.given_name} {person.family_name || ''}</p>
        )}
      </div>
    </div>
  );
};

export default PeopleCard;
