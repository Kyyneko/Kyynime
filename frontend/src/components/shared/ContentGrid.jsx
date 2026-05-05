import React from 'react';
import { SkeletonGrid } from './SkeletonCard';

const ContentGrid = ({
  data = [],
  isLoading = false,
  error = null,
  onRetry,
  emptyIcon = '🔍',
  emptyTitle = 'No Results Found',
  emptyMessage = 'Try searching with different keywords',
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  renderCard,
  skeletonCount = 24,
}) => {
  if (isLoading) {
    return <SkeletonGrid count={skeletonCount} columns={columns} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="relative mb-8">
          <div className="text-8xl">😔</div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-[theme(--color-text-primary)] mb-3 text-center">
          Oops! Something went wrong
        </h3>
        <p className="text-[theme(--color-text-secondary)] mb-8 text-center max-w-md text-base leading-relaxed">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="group px-8 py-3.5 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-base"
          >
            <span className="text-xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-8xl mb-6 animate-bounce">{emptyIcon}</div>
        <h3 className="text-2xl md:text-3xl font-black text-[theme(--color-text-primary)] mb-3 text-center">
          {emptyTitle}
        </h3>
        <p className="text-[theme(--color-text-secondary)] text-center max-w-md text-base leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${columns} gap-4 md:gap-5`}>
      {data.map((item, index) => (
        <div
          key={item.mal_id || index}
          className="stagger-card"
          style={{ animationDelay: `${(index % 24) * 40}ms` }}
        >
          {renderCard(item, index)}
        </div>
      ))}
    </div>
  );
};

export default ContentGrid;
