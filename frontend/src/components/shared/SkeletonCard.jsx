import React from 'react';

/* ============================================================
   SKELETON CARD — realistic card placeholder with shimmer
   ============================================================ */
const SkeletonCard = ({ index = 0 }) => {
  const delay = (index % 12) * 60; // staggered entrance

  return (
    <div
      className="rounded-xl overflow-hidden border border-[theme(--color-border)]/50 bg-[theme(--color-dark-card)] stagger-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image area */}
      <div className="relative aspect-[2/3] skeleton-shimmer">
        {/* Fake score badge */}
        <div className="absolute top-3 right-3 w-14 h-6 rounded-lg skeleton-bar" />
        {/* Fake type + ep badges at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between">
          <div className="w-10 h-5 rounded skeleton-bar" />
          <div className="w-14 h-5 rounded skeleton-bar" />
        </div>
      </div>
      {/* Text area */}
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton-bar w-[90%]" />
        <div className="h-3.5 skeleton-bar w-[60%]" />
      </div>
    </div>
  );
};

/* ============================================================
   SKELETON GRID — a full grid of skeleton cards
   ============================================================ */
export const SkeletonGrid = ({
  count = 24,
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
}) => {
  return (
    <div className={`grid ${columns} gap-4 md:gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
};

/* ============================================================
   SKELETON HERO — homepage hero banner placeholder
   ============================================================ */
export const SkeletonHero = () => (
  <div className="relative rounded-2xl overflow-hidden mb-10 bg-[theme(--color-dark-card)] border border-[theme(--color-border)]/30">
    <div className="skeleton-shimmer absolute inset-0" />
    <div className="relative z-10 px-6 md:px-10 py-12 md:py-20 lg:py-24 max-w-2xl">
      {/* Badges */}
      <div className="flex gap-2 mb-5">
        <div className="h-7 w-28 rounded-full skeleton-bar" />
        <div className="h-7 w-16 rounded-full skeleton-bar" />
      </div>
      {/* Title */}
      <div className="space-y-3 mb-5">
        <div className="h-10 md:h-14 skeleton-bar w-[80%]" />
        <div className="h-5 skeleton-bar w-[40%]" />
      </div>
      {/* Synopsis lines */}
      <div className="space-y-2 mb-6">
        <div className="h-4 skeleton-bar w-full" />
        <div className="h-4 skeleton-bar w-[95%]" />
        <div className="h-4 skeleton-bar w-[70%]" />
      </div>
      {/* Genre pills */}
      <div className="flex gap-2 mb-6">
        <div className="h-7 w-20 rounded-full skeleton-bar" />
        <div className="h-7 w-24 rounded-full skeleton-bar" />
        <div className="h-7 w-16 rounded-full skeleton-bar" />
      </div>
      {/* CTA buttons */}
      <div className="flex gap-3">
        <div className="h-12 w-36 rounded-xl skeleton-bar" />
        <div className="h-12 w-40 rounded-xl skeleton-bar" />
      </div>
    </div>
    {/* Right image placeholder (desktop) */}
    <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-10">
      <div className="w-52 h-72 rounded-2xl skeleton-shimmer border-4 border-white/5" />
    </div>
  </div>
);

/* ============================================================
   SKELETON HORIZONTAL — horizontal scroll placeholder
   ============================================================ */
export const SkeletonHorizontalItem = ({ index = 0 }) => (
  <div
    className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] stagger-card"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    <div className="rounded-xl overflow-hidden border border-[theme(--color-border)]/50 bg-[theme(--color-dark-card)]">
      <div className="aspect-[2/3] skeleton-shimmer relative">
        <div className="absolute top-2 right-2 w-12 h-5 rounded-md skeleton-bar" />
      </div>
      <div className="p-2.5 space-y-1.5">
        <div className="h-3.5 skeleton-bar w-[85%]" />
        <div className="h-3 skeleton-bar w-[55%]" />
      </div>
    </div>
  </div>
);

/* ============================================================
   SKELETON DETAIL — full detail page placeholder
   ============================================================ */
export const SkeletonDetail = () => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Back button */}
      <div className="h-5 w-32 skeleton-bar mb-6 rounded" />

      <div className="bg-[theme(--color-dark-card)] rounded-2xl overflow-hidden border border-[theme(--color-border)]/50">
        {/* Header area */}
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[theme(--color-dark-light)] to-[theme(--color-dark-card)]">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cover image */}
            <div className="w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 rounded-xl skeleton-shimmer border-4 border-[theme(--color-border)]/30 mx-auto lg:mx-0 flex-shrink-0" />
            {/* Text content */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div className="h-8 lg:h-10 skeleton-bar w-[75%]" />
              {/* Japanese title */}
              <div className="h-5 skeleton-bar w-[45%]" />
              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-20 rounded-xl skeleton-bar" />
                <div className="h-8 w-14 rounded-xl skeleton-bar" />
                <div className="h-8 w-28 rounded-xl skeleton-bar" />
                <div className="h-8 w-24 rounded-xl skeleton-bar" />
                <div className="h-8 w-16 rounded-xl skeleton-bar" />
              </div>
              {/* Genre pills */}
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-16 rounded-full skeleton-bar" />
                <div className="h-7 w-20 rounded-full skeleton-bar" />
                <div className="h-7 w-14 rounded-full skeleton-bar" />
                <div className="h-7 w-18 rounded-full skeleton-bar" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 sm:px-8 py-3 border-t border-b border-[theme(--color-border)]/50 bg-[theme(--color-dark-light)]">
          {[80, 96, 72, 64, 112].map((w, i) => (
            <div
              key={i}
              className="h-10 rounded-lg skeleton-bar"
              style={{ width: `${w}px`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Content skeleton — synopsis */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Section title */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded skeleton-bar" />
            <div className="h-6 w-28 skeleton-bar" />
          </div>
          {/* Synopsis box */}
          <div className="bg-[theme(--color-dark-light)]/50 border border-[theme(--color-border)]/30 p-4 sm:p-6 rounded-xl space-y-3">
            <div className="h-4 skeleton-bar w-full" />
            <div className="h-4 skeleton-bar w-full" />
            <div className="h-4 skeleton-bar w-[98%]" />
            <div className="h-4 skeleton-bar w-full" />
            <div className="h-4 skeleton-bar w-[85%]" />
            <div className="h-4 skeleton-bar w-[60%]" />
          </div>

          {/* Info grid */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded skeleton-bar" />
            <div className="h-6 w-32 skeleton-bar" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-[theme(--color-dark-light)]/50 border border-[theme(--color-border)]/30 p-3 sm:p-4 rounded-xl flex gap-2" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="h-4 w-16 skeleton-bar" />
                <div className="h-4 w-24 skeleton-bar" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SKELETON RANDOM — random page loading card
   ============================================================ */
export const SkeletonRandom = () => (
  <div className="bg-[theme(--color-dark-card)] rounded-2xl border border-[theme(--color-border)]/50 overflow-hidden shadow-2xl animate-fade-in">
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="md:w-1/3">
        <div className="w-full h-64 md:h-80 skeleton-shimmer" />
      </div>
      {/* Info */}
      <div className="md:w-2/3 p-6 space-y-4">
        <div className="h-8 skeleton-bar w-[70%]" />
        <div className="h-5 skeleton-bar w-[40%]" />
        <div className="flex gap-2">
          <div className="h-7 w-16 rounded-lg skeleton-bar" />
          <div className="h-7 w-14 rounded-lg skeleton-bar" />
          <div className="h-7 w-24 rounded-lg skeleton-bar" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-6 w-16 rounded-full skeleton-bar" />
          <div className="h-6 w-20 rounded-full skeleton-bar" />
          <div className="h-6 w-14 rounded-full skeleton-bar" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 skeleton-bar w-full" />
          <div className="h-4 skeleton-bar w-[95%]" />
          <div className="h-4 skeleton-bar w-[80%]" />
          <div className="h-4 skeleton-bar w-[50%]" />
        </div>
        <div className="flex gap-3 pt-4">
          <div className="h-12 w-36 rounded-xl skeleton-bar" />
          <div className="h-12 w-32 rounded-xl skeleton-bar" />
        </div>
      </div>
    </div>
  </div>
);

/* ============================================================
   SKELETON SEARCH — search page header placeholder
   ============================================================ */
export const SkeletonSearch = () => (
  <div className="animate-fade-in space-y-4 mb-6">
    <div className="h-7 skeleton-bar w-[50%]" />
    <div className="h-4 skeleton-bar w-[25%]" />
  </div>
);

export default SkeletonCard;
