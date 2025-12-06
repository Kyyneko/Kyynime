import React, { useState } from 'react';

const Navbar = ({ activeView, onViewChange }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { id: 'anime', icon: '🎬', label: 'Anime' },
        { id: 'manga', icon: '📖', label: 'Manga' },
        { id: 'characters', icon: '👥', label: 'Characters' },
        { id: 'people', icon: '🎭', label: 'People' },
        { id: 'random', icon: '🎲', label: 'Random' },
    ];

    const handleNavClick = (id) => {
        onViewChange(id);
        setMenuOpen(false);
    };

    return (
        <nav className="bg-[theme(--color-dark-light)] backdrop-blur-lg shadow-2xl border-b-2 border-[theme(--color-border)] sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Logo Section */}
                    <div 
                        className="flex items-center space-x-3 group cursor-pointer" 
                        onClick={() => handleNavClick('anime')}
                    >
                        <div className="text-3xl md:text-4xl transform group-hover:rotate-12 transition-transform duration-300">
                            🎌
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-[theme(--color-primary)] via-[theme(--color-primary-light)] to-[theme(--color-accent)] bg-clip-text text-transparent tracking-tight">
                                Kyynime
                            </h1>
                            <p className="text-[10px] md:text-xs text-[theme(--color-text-muted)] font-medium tracking-wide hidden sm:block">
                                Your Anime Paradise
                            </p>
                        </div>
                    </div>
                    
                    {/* Desktop Navigation Buttons */}
                    <div className="hidden md:flex gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                className={`relative px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 overflow-hidden group whitespace-nowrap ${
                                    activeView === item.id
                                        ? 'bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white shadow-lg shadow-[theme(--color-primary)]/50'
                                        : 'bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] hover:text-white border border-[theme(--color-border)] hover:border-[theme(--color-primary)]/50'
                                }`}
                                onClick={() => handleNavClick(item.id)}
                            >
                                {activeView !== item.id && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-[theme(--color-primary)]/10 to-[theme(--color-accent)]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                )}
                                <span className="relative flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Mobile Hamburger Menu */}
                    <button
                        className="md:hidden p-2 text-white bg-[theme(--color-dark-card)] rounded-lg border border-[theme(--color-border)] hover:border-[theme(--color-primary)] transition-all"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`relative px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                                        activeView === item.id
                                            ? 'bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-primary-dark)] text-white shadow-lg'
                                            : 'bg-[theme(--color-dark-card)] text-[theme(--color-text-secondary)] hover:text-white border border-[theme(--color-border)]'
                                    }`}
                                    onClick={() => handleNavClick(item.id)}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
