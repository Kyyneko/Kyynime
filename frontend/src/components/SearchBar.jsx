import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative flex gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search your favorite anime... (e.g., Naruto, One Piece)"
                        className="w-full px-6 py-4 pr-20 bg-[theme(--color-dark-card)] text-white placeholder-[theme(--color-text-muted)] rounded-2xl border-2 border-[theme(--color-border)] focus:border-[theme(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[theme(--color-primary)]/20 transition-all duration-300 shadow-lg font-medium"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-[theme(--color-text-muted)] hover:text-red-500 transition-colors duration-200"
                        >
                            ✕
                        </button>
                    )}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[theme(--color-text-muted)] pointer-events-none">
                        💭
                    </div>
                </div>
                <button 
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-[theme(--color-primary)]/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                    <span className="text-xl">🔍</span>
                    <span className="hidden sm:inline">Search</span>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
