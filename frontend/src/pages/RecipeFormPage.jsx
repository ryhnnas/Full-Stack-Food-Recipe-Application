// src/pages/RecipeFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { createRecipe, getRecipeById, updateRecipe, getCategories } from '../services/api';
import './RecipeFormPage.css'; // Buat file CSS untuk form ini

function RecipeFormPage() {
    const { id } = useParams(); // Akan ada jika dalam mode edit
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: [{ item: '', quantity: '' }], // Array of objects
        instructions: [{ text: '' }], // Array of objects
        image_url: '',
        category_id: '',
        prep_time: '',
        cook_time: '',
        servings: '',
        difficulty: 'Mudah', // Default
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFormData = async () => {
            try {
                setLoading(true);
                const categoriesData = await getCategories();
                setCategories(categoriesData);

                if (id) { // Jika ada ID, berarti mode edit
                    setIsEditing(true);
                    const recipeData = await getRecipeById(id);
                    // Pastikan ingredients dan instructions adalah array setelah parsing
                    recipeData.ingredients = JSON.parse(recipeData.ingredients);
                    recipeData.instructions = JSON.parse(recipeData.instructions);

                    setFormData({
                        ...recipeData,
                        category_id: String(recipeData.category_id), // Pastikan string untuk select option
                        // Handle case where arrays might be empty after parsing
                        ingredients: recipeData.ingredients.length > 0 ? recipeData.ingredients : [{ item: '', quantity: '' }],
                        instructions: recipeData.instructions.length > 0 ? recipeData.instructions : [{ text: '' }],
                    });
                }
            } catch (err) {
                setError('Gagal memuat data resep atau kategori. Silakan coba lagi.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadFormData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const newIngredients = formData.ingredients.map((ing, i) => {
            if (i === index) {
                return { ...ing, [name]: value };
            }
            return ing;
        });
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const addIngredient = () => {
        setFormData({ ...formData, ingredients: [...formData.ingredients, { item: '', quantity: '' }] });
    };

    const removeIngredient = (index) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: newIngredients.length > 0 ? newIngredients : [{ item: '', quantity: '' }] });
    };

    const handleInstructionChange = (index, e) => {
        const newInstructions = formData.instructions.map((inst, i) => {
            if (i === index) {
                return { ...inst, text: e.target.value };
            }
            return inst;
        });
        setFormData({ ...formData, instructions: newInstructions });
    };

    const addInstruction = () => {
        setFormData({ ...formData, instructions: [...formData.instructions, { text: '' }] });
    };

    const removeInstruction = (index) => {
        const newInstructions = formData.instructions.filter((_, i) => i !== index);
        setFormData({ ...formData, instructions: newInstructions.length > 0 ? newInstructions : [{ text: '' }] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Filter out empty ingredients/instructions before sending
        const filteredIngredients = formData.ingredients.filter(ing => ing.item && ing.quantity);
        const filteredInstructions = formData.instructions.filter(inst => inst.text);

        if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
            setError('Bahan dan langkah-langkah tidak boleh kosong.');
            setLoading(false);
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                ingredients: filteredIngredients,
                instructions: filteredInstructions,
                category_id: parseInt(formData.category_id), // Pastikan category_id adalah integer
            };

            if (isEditing) {
                await updateRecipe(id, dataToSubmit);
                alert('Resep berhasil diperbarui!');
            } else {
                await createRecipe(dataToSubmit);
                alert('Resep berhasil ditambahkan!');
            }
            navigate('/'); // Kembali ke homepage setelah sukses
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan resep.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.title) return <div className="loading-state">Memuat formulir...</div>;
    if (error && !formData.title) return <div className="error-state">{error}</div>; // Hanya tampilkan error jika tidak ada data awal

    return (
        <div className="recipe-form-page">
            <Header />
            <main className="form-container">
                <h1>{isEditing ? 'Edit Resep' : 'Tambah Resep Baru'}</h1>
                {error && <div className="form-error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="recipe-form">
                    <div className="form-group">
                        <label htmlFor="title">Judul Resep:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Deskripsi Singkat:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image_url">URL Gambar Resep:</label>
                        <input
                            type="text"
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="/images/nama-gambar.jpg atau URL online"
                        />
                        {formData.image_url && (
                            <div className="image-preview">
                                <img src={formData.image_url} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">Kategori:</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-section">
                        <h3>Bahan-Bahan:</h3>
                        {formData.ingredients.map((ing, index) => (
                            <div key={index} className="ingredient-input-group">
                                <input
                                    type="text"
                                    name="item"
                                    placeholder="Nama Bahan (ex: Bawang Merah)"
                                    value={ing.item}
                                    onChange={(e) => handleIngredientChange(index, e)}
                                    required={index === 0} // Wajibkan yang pertama
                                />
                                <input
                                    type="text"
                                    name="quantity"
                                    placeholder="Jumlah (ex: 3 siung)"
                                    value={ing.quantity}
                                    onChange={(e) => handleIngredientChange(index, e)}
                                    required={index === 0} // Wajibkan yang pertama
                                />
                                {formData.ingredients.length > 1 && (
                                    <button type="button" onClick={() => removeIngredient(index)} className="remove-btn">
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addIngredient} className="add-btn">
                            + Tambah Bahan
                        </button>
                    </div>

                    <div className="form-section">
                        <h3>Langkah-Langkah:</h3>
                        {formData.instructions.map((inst, index) => (
                            <div key={index} className="instruction-input-group">
                                <textarea
                                    placeholder={`Langkah ${index + 1}`}
                                    value={inst.text}
                                    onChange={(e) => handleInstructionChange(index, e)}
                                    rows="2"
                                    required={index === 0} // Wajibkan yang pertama
                                ></textarea>
                                {formData.instructions.length > 1 && (
                                    <button type="button" onClick={() => removeInstruction(index)} className="remove-btn">
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addInstruction} className="add-btn">
                            + Tambah Langkah
                        </button>
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group">
                            <label htmlFor="prep_time">Waktu Persiapan:</label>
                            <input type="text" id="prep_time" name="prep_time" value={formData.prep_time} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cook_time">Waktu Memasak:</label>
                            <input type="text" id="cook_time" name="cook_time" value={formData.cook_time} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group-inline">
                        <div className="form-group">
                            <label htmlFor="servings">Porsi:</label>
                            <input type="text" id="servings" name="servings" value={formData.servings} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="difficulty">Kesulitan:</label>
                            <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                                <option value="Mudah">Mudah</option>
                                <option value="Sedang">Sedang</option>
                                <option value="Sulit">Sulit</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Menyimpan...' : (isEditing ? 'Perbarui Resep' : 'Tambah Resep')}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="cancel-button">
                        Batal
                    </button>
                </form>
            </main>
        </div>
    );
}

export default RecipeFormPage;