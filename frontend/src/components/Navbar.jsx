import React from 'react';

const Navbar = ({ activeView, onViewChange }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>🎌 AnimeHub</h1>
            </div>
            <div className="navbar-menu">
                <button 
                    className={activeView === 'search' ? 'nav-item active' : 'nav-item'}
                    onClick={() => onViewChange('search')}
                >
                    Search
                </button>
                <button 
                    className={activeView === 'top' ? 'nav-item active' : 'nav-item'}
                    onClick={() => onViewChange('top')}
                >
                    Top Anime
                </button>
                <button 
                    className={activeView === 'seasonal' ? 'nav-item active' : 'nav-item'}
                    onClick={() => onViewChange('seasonal')}
                >
                    Seasonal
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
