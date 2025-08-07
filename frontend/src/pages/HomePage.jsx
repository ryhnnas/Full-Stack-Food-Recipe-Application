// src/pages/HomePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { getRecipes, getCategories } from '../services/api';
import './HomePage.css'; // Buat file CSS untuk HomePage

function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            const recipesData = await getRecipes(searchTerm, selectedCategory);
            setRecipes(recipesData);
        } catch (err) {
            setError('Gagal memuat resep. Silakan coba lagi nanti.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedCategory]);

    useEffect(() => {
        const fetchAllInitialData = async () => {
            try {
                setLoading(true);
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                // Setelah kategori didapat, baru ambil resep
                await fetchRecipes(); // Panggil fungsi fetchRecipes yang sudah di-memo
            } catch (err) {
                setError('Gagal memuat data awal (kategori atau resep).');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllInitialData();
    }, [fetchRecipes]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setSelectedCategory('');
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? '' : categoryId); // Toggle selection
        setSearchTerm('');
    };

    const handleResetSearch = () => {
        setSearchTerm(''); // Mengatur searchTerm kembali ke string kosong
        setSelectedCategory(''); // Juga reset kategori yang dipilih
    };

    if (loading) return <div className="loading-state">Memuat resep...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="home-page">
            {/* Teruskan fungsi handleResetSearch ke komponen Header */}
            <Header onSearch={handleSearch} onHomeClick={handleResetSearch} />
            <main className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1>Temukan Inspirasi Resep Harian Anda!</h1>
                    <p>Jelajahi ribuan resep lezat dari berbagai kategori dan bahan.</p>
                </section>

                {/* Tombol Tambah Resep Baru */}
                <section className="add-recipe-section">
                    <Link to="/add-recipe" className="add-recipe-button">
                        + Tambah Resep Baru
                    </Link>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <h2>Jelajahi Kategori</h2>
                    <div className="category-list">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`category-button ${selectedCategory === String(category.id) ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(String(category.id))}
                            >
                                {category.name}
                            </button>
                        ))}
                        {(searchTerm || selectedCategory) && ( // Tampilkan tombol reset hanya jika ada filter aktif
                            <button className="category-button reset-filter" onClick={handleResetSearch}>
                                Tampilkan Semua Resep
                            </button>
                        )}
                    </div>
                </section>

                {/* Recipes Grid */}
                <section className="recipes-grid-section">
                    <h2>{searchTerm ? `Hasil Pencarian untuk "${searchTerm}"` : selectedCategory ? `Resep Kategori: ${categories.find(cat => String(cat.id) === selectedCategory)?.name}` : 'Resep Terbaru'}</h2>
                    {recipes.length > 0 ? (
                        <div className="recipes-grid">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <p className="no-results">Tidak ada resep yang ditemukan.</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default HomePage;