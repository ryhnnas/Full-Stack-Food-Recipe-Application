// src/pages/RecipeDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { getRecipeById, deleteRecipe } from '../services/api';
import './RecipeDetailPage.css'; // Buat file CSS untuk Detail Resep

function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const data = await getRecipeById(id);
                // Parse JSON strings back to arrays/objects
                data.ingredients = JSON.parse(data.ingredients);
                data.instructions = JSON.parse(data.instructions);
                setRecipe(data);
            } catch (err) {
                setError('Gagal memuat detail resep. Resep mungkin tidak ditemukan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
            try {
                setLoading(true);
                await deleteRecipe(id);
                alert('Resep berhasil dihapus!');
                navigate('/'); // Kembali ke homepage setelah dihapus
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal menghapus resep.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <div className="loading-state">Memuat detail resep...</div>;
    if (error) return <div className="error-state">{error}</div>;
    if (!recipe) return <div className="no-data-state">Resep tidak ditemukan.</div>;

    return (
        <div className="recipe-detail-page">
            <Header /> {/* Header tanpa fungsi search di sini, atau buat versi lain */}
            <main className="detail-content">
                <div className="recipe-header">
                    <img src={recipe.image_url || '/images/placeholder.jpg'} alt={recipe.title} className="recipe-main-image" />
                    <div className="recipe-title-section">
                        <h1>{recipe.title}</h1>
                        <p className="recipe-category-tag">{recipe.category_name}</p>
                        <p className="recipe-description">{recipe.description}</p>
                        <div className="recipe-meta">
                            <span>⏱️ {recipe.prep_time}</span>
                            <span>🍳 {recipe.cook_time}</span>
                            <span>🍽️ {recipe.servings}</span>
                            <span>💪 {recipe.difficulty}</span>
                        </div>
                        <div className="recipe-actions">
                            <Link to={`/edit-recipe/${recipe.id}`} className="edit-button">Edit Resep</Link>
                            <button onClick={handleDelete} className="delete-button" disabled={loading}>
                                {loading ? 'Menghapus...' : 'Hapus Resep'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="recipe-sections">
                    <section className="ingredients-section">
                        <h2>Bahan-Bahan</h2>
                        <ul>
                            {recipe.ingredients.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.quantity}</strong> {item.item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="instructions-section">
                        <h2>Langkah-Langkah</h2>
                        <ol>
                            {recipe.instructions.map((step, index) => (
                                <li key={index}>{step.text}</li>
                            ))}
                        </ol>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default RecipeDetailPage;