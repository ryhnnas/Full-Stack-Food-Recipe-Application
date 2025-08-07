// src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getCategories, getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './CategoriesPage.css'; // Buat file CSS untuk CategoriesPage

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null); // ID kategori yang dipilih

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                // Jika belum ada kategori yang dipilih, tampilkan semua resep atau resep dari kategori pertama
                const initialRecipes = await getRecipes('', selectedCategory || (categoriesData.length > 0 ? categoriesData[0].id : ''));
                setRecipes(initialRecipes);
            } catch (err) {
                setError('Gagal memuat kategori atau resep.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Efek ini hanya berjalan sekali saat komponen dimuat

    useEffect(() => {
        const fetchRecipesByCategory = async () => {
            if (selectedCategory !== null) {
                setLoading(true);
                try {
                    const recipesData = await getRecipes('', selectedCategory);
                    setRecipes(recipesData);
                } catch (err) {
                    setError('Gagal memuat resep untuk kategori ini.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchRecipesByCategory();
    }, [selectedCategory]); // Efek ini berjalan saat selectedCategory berubah

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    if (loading) return <div className="loading-state">Memuat kategori...</div>;
    if (error) return <div className="error-state">{error}</div>;

    const currentCategoryName = selectedCategory
        ? categories.find(cat => String(cat.id) === String(selectedCategory))?.name
        : "Semua Kategori";


    return (
        <div className="categories-page">
            <Header /> {/* Header tanpa fungsi search yang khusus untuk halaman ini */}
            <main className="categories-main-content">
                <h1>Jelajahi Resep Berdasarkan Kategori</h1>

                <div className="category-selection">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-button ${String(category.id) === String(selectedCategory) ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                     {selectedCategory && (
                        <button className="category-button reset-filter" onClick={() => setSelectedCategory(null)}>
                            Tampilkan Semua
                        </button>
                    )}
                </div>

                <h2 className="category-recipes-title">Resep di {currentCategoryName}</h2>
                {recipes.length > 0 ? (
                    <div className="recipes-grid">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <p className="no-results">Tidak ada resep ditemukan untuk kategori ini.</p>
                )}
            </main>
        </div>
    );
}

export default CategoriesPage;