import React from "react";

const MangaCard = ({ manga, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(manga.mal_id);
    }
  };

  const imageUrl =
    manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url;

  const year = manga.published?.prop?.from?.year;
  const isPublishing = manga.status === "Publishing";
  const isFinished = manga.status && manga.status !== "Publishing";

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[theme(--color-dark-card)] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[theme(--color-primary)]/40 border border-[theme(--color-border)] hover:border-[theme(--color-primary)]"
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[theme(--color-dark-light)]">
        <img
          src={imageUrl}
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Score Badge */}
        {manga.score && (
          <div className="absolute top-3 right-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-2.5 py-1 rounded-lg font-black text-sm shadow-xl flex items-center gap-1">
            <span>⭐</span>
            <span>{manga.score}</span>
          </div>
        )}

        {/* Rank Badge */}
        {manga.rank && manga.rank <= 100 && (
          <div className="absolute top-3 left-3 bg-gradient-to-br from-purple-600 to-pink-600 text-white w-10 h-10 rounded-full font-black text-sm shadow-xl flex items-center justify-center border-2 border-white/30">
            #{manga.rank}
          </div>
        )}

        {/* Type & Chapters */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-between text-xs">
            <span className="bg-[theme(--color-primary)] text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
              {manga.type || "Manga"}
            </span>
            {manga.chapters && (
              <span className="text-white font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
                {manga.chapters} ch
              </span>
            )}
          </div>
        </div>

        {/* Publishing Status */}
        {isPublishing && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>ONGOING</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-3 space-y-2">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[theme(--color-primary)] transition-colors duration-200">
          {manga.title}
        </h3>

        <div className="flex items-center justify-between text-xs">
          {year && (
            <span className="text-[theme(--color-text-muted)] font-semibold">
              {year}
            </span>
          )}
          {isFinished && (
            <span className="text-[theme(--color-accent)] font-bold">
              ✓ Finished
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaCard;
