import React from 'react';

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  if (!lastPage || lastPage <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(lastPage, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < lastPage) {
      if (end < lastPage - 1) pages.push('...');
      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10 mb-4 animate-fade-in">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:text-white disabled:hover:border-[theme(--color-border)] disabled:hover:text-[theme(--color-text-secondary)]"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-[theme(--color-text-muted)] font-bold">
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${
              currentPage === page
                ? 'bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white shadow-lg shadow-[theme(--color-primary)]/50 scale-110'
                : 'bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:text-white'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:text-white disabled:hover:border-[theme(--color-border)] disabled:hover:text-[theme(--color-text-secondary)]"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
