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
  loadingIcon = '🎌',
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
        <div className="text-8xl mb-6">😔</div>
        <h3 className="text-3xl font-black text-[theme(--color-text-primary)] mb-4">
          Oops! Something went wrong
        </h3>
        <p className="text-[theme(--color-text-secondary)] mb-8 text-center max-w-md text-lg">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-10 py-4 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <span className="text-2xl">🔄</span>
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-8xl mb-6">{emptyIcon}</div>
        <h3 className="text-3xl font-black text-[theme(--color-text-primary)] mb-4">
          {emptyTitle}
        </h3>
        <p className="text-[theme(--color-text-secondary)] text-center max-w-md text-lg">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${columns} gap-4 md:gap-5 animate-scale-in`}>
      {data.map((item, index) => renderCard(item, index))}
    </div>
  );
};

export default ContentGrid;
