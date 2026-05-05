import React from 'react';

const SkeletonCard = ({ type = 'anime' }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-[theme(--color-border)] bg-[theme(--color-dark-card)]">
      {/* Image placeholder */}
      <div className="aspect-[2/3] bg-[theme(--color-dark-light)] animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
      {/* Text placeholder */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[theme(--color-dark-light)] rounded-md animate-pulse w-[85%]" />
        <div className="h-3 bg-[theme(--color-dark-light)] rounded-md animate-pulse w-[60%]" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 24, columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' }) => {
  return (
    <div className={`grid ${columns} gap-4 md:gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonDetail = () => {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      {/* Header */}
      <div className="bg-[theme(--color-dark-card)] rounded-2xl overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-48 h-72 bg-[theme(--color-dark-light)] rounded-xl mx-auto lg:mx-0 skeleton-shimmer" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-[theme(--color-dark-light)] rounded-lg w-3/4" />
              <div className="h-5 bg-[theme(--color-dark-light)] rounded-lg w-1/2" />
              <div className="flex gap-2">
                <div className="h-10 bg-[theme(--color-dark-light)] rounded-xl w-20" />
                <div className="h-10 bg-[theme(--color-dark-light)] rounded-xl w-16" />
                <div className="h-10 bg-[theme(--color-dark-light)] rounded-xl w-24" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 bg-[theme(--color-dark-light)] rounded-full w-16" />
                <div className="h-7 bg-[theme(--color-dark-light)] rounded-full w-20" />
                <div className="h-7 bg-[theme(--color-dark-light)] rounded-full w-14" />
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 px-8 py-4 border-t border-[theme(--color-border)]">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-[theme(--color-dark-light)] rounded-lg w-24" />
          ))}
        </div>
        {/* Content */}
        <div className="p-8 space-y-4">
          <div className="h-6 bg-[theme(--color-dark-light)] rounded-lg w-40" />
          <div className="space-y-2">
            <div className="h-4 bg-[theme(--color-dark-light)] rounded w-full" />
            <div className="h-4 bg-[theme(--color-dark-light)] rounded w-full" />
            <div className="h-4 bg-[theme(--color-dark-light)] rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
