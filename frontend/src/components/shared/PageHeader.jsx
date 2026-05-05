import React from 'react';

const PageHeader = ({ icon, title, count, countLabel = 'found', subtitle, isLoading = false }) => {
  return (
    <div className="mb-6 animate-slide-up">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-4xl">{icon}</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-[theme(--color-text-secondary)] mb-2 text-base">{subtitle}</p>
      )}
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-2 h-2 bg-[theme(--color-primary)] rounded-full animate-ping" />
          <span className="text-[theme(--color-text-muted)] font-medium">Loading results...</span>
        </div>
      ) : count !== undefined && count !== null ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-2 h-2 bg-[theme(--color-accent)] rounded-full animate-pulse shadow-lg shadow-[theme(--color-accent)]/50" />
          <span className="text-[theme(--color-text-secondary)] font-medium">
            <span className="text-white font-bold">{count}</span> {countLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default PageHeader;
