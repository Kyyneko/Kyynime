import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonHorizontalItem } from './SkeletonCard';

const HorizontalScroll = ({ title, icon, data = [], renderCard, linkTo, linkText = 'View All', isLoading = false }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [data]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mb-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl">{icon}</span>
          <h2 className="text-xl md:text-2xl font-black text-white">{title}</h2>
        </div>
        {linkTo && (
          <Link
            to={linkTo}
            className="text-sm font-bold text-[theme(--color-primary)] hover:text-[theme(--color-primary-light)] transition-colors flex items-center gap-1 group"
          >
            {linkText}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        )}
      </div>

      {/* Scroll Container */}
      <div className="relative group/scroll">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[theme(--color-dark)]/90 backdrop-blur-sm border border-[theme(--color-border)] rounded-full flex items-center justify-center text-white hover:bg-[theme(--color-primary)] hover:border-[theme(--color-primary)] transition-all opacity-0 group-hover/scroll:opacity-100 -translate-x-2 group-hover/scroll:translate-x-0 shadow-xl"
          >
            ‹
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[theme(--color-dark)]/90 backdrop-blur-sm border border-[theme(--color-border)] rounded-full flex items-center justify-center text-white hover:bg-[theme(--color-primary)] hover:border-[theme(--color-primary)] transition-all opacity-0 group-hover/scroll:opacity-100 translate-x-2 group-hover/scroll:translate-x-0 shadow-xl"
          >
            ›
          </button>
        )}

        {/* Gradient Masks */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[theme(--color-dark)] to-transparent z-[5] pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[theme(--color-dark)] to-transparent z-[5] pointer-events-none" />
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonHorizontalItem key={i} index={i} />)
            : data.map((item, index) => (
                <div key={item.mal_id || index} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                  {renderCard(item)}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll;
