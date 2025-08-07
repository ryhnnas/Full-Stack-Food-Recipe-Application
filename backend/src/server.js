// server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Koneksi database
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Izinkan semua permintaan CORS dari frontend
app.use(express.json()); // Izinkan aplikasi memparsing JSON body dari request

// --- Routes ---

// 1. Get All Categories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2. Get All Recipes (with optional search and category filter)
app.get('/api/recipes', async (req, res) => {
    const { search, category_id } = req.query;
    let query = 'SELECT r.*, c.name AS category_name FROM recipes r JOIN categories c ON r.category_id = c.id WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND (r.title LIKE ? OR r.ingredients LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
        query += ' AND r.category_id = ?';
        params.push(category_id);
    }

    query += ' ORDER BY r.created_at DESC'; // Urutkan resep terbaru dulu

    try {
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3. Get Recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT r.*, c.name AS category_name FROM recipes r JOIN categories c ON r.category_id = c.id WHERE r.id = ?',
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching recipe by ID:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 4. Create New Recipe (POST) - Contoh sederhana
// PERHATIAN: Untuk production, tambahkan validasi input dan autentikasi!
app.post('/api/recipes', async (req, res) => {
    // Destrukturisasi data dari body request
    const { title, description, ingredients, instructions, image_url, category_id, prep_time, cook_time, servings, difficulty } = req.body;

    // --- PENTING: Lakukan validasi input di sini ---
    // Contoh validasi sederhana:
    if (!title || !ingredients || !instructions || !category_id) {
        return res.status(400).json({ message: 'Title, ingredients, instructions, and category_id are required.' });
    }

    try {
        // Karena ingredients dan instructions akan datang sebagai array dari frontend,
        // kita perlu mengubahnya kembali menjadi string JSON untuk disimpan di DB.
        const ingredientsJson = JSON.stringify(ingredients);
        const instructionsJson = JSON.stringify(instructions);

        const [result] = await db.execute(
            'INSERT INTO recipes (title, description, ingredients, instructions, image_url, category_id, prep_time, cook_time, servings, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, ingredientsJson, instructionsJson, image_url, category_id, prep_time, cook_time, servings, difficulty]
        );
        res.status(201).json({ message: 'Recipe added successfully!', id: result.insertId });
    } catch (err) {
        console.error('Error adding new recipe:', err);
        res.status(500).json({ message: 'Server error occurred while adding recipe.' });
    }
});

// 5. Update Existing Recipe (PUT /api/recipes/:id)
app.put('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, ingredients, instructions, image_url, category_id, prep_time, cook_time, servings, difficulty } = req.body;

    // --- PENTING: Lakukan validasi input di sini ---
    if (!title || !ingredients || !instructions || !category_id) {
        return res.status(400).json({ message: 'Title, ingredients, instructions, and category_id are required.' });
    }

    try {
        const ingredientsJson = JSON.stringify(ingredients);
        const instructionsJson = JSON.stringify(instructions);

        const [result] = await db.execute(
            'UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ?, image_url = ?, category_id = ?, prep_time = ?, cook_time = ?, servings = ?, difficulty = ? WHERE id = ?',
            [title, description, ingredientsJson, instructionsJson, image_url, category_id, prep_time, cook_time, servings, difficulty, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found or no changes made.' });
        }
        res.json({ message: 'Recipe updated successfully!' });
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).json({ message: 'Server error occurred while updating recipe.' });
    }
});

// 6. Delete Recipe (DELETE /api/recipes/:id)
app.delete('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM recipes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }
        res.json({ message: 'Recipe deleted successfully!' });
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).json({ message: 'Server error occurred while deleting recipe.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Backend URL: http://localhost:${PORT}`);
});