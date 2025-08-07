// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Buat file CSS untuk Header

function Header({ onSearch, onHomeClick }) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleHomeLinkClick = () => {
        setSearchTerm(''); // Reset searchTerm di internal state Header
        if (onHomeClick) {
            onHomeClick(); // Beri tahu HomePage untuk mereset pencarian
        }
    };

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="app-logo">Dapur Resepku</Link>
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder="Cari resep (misal: ayam goreng, pasta)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">Cari</button>
                </form>
                <nav className="main-nav">
                    <Link to="/" onClick={handleHomeLinkClick}>Beranda</Link>
                    <Link to="/categories">Kategori</Link>
                    {/* <Link to="/about">Tentang Kami</Link> */}
                </nav>
            </div>
        </header>
    );
}

export default Header;