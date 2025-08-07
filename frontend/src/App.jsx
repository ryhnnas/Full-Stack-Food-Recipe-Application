// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import RecipeFormPage from './pages/RecipeFormPage';
import './App.css'; // Opsional, untuk gaya global App

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/add-recipe" element={<RecipeFormPage />} /> {/* Rute untuk tambah resep */}
                <Route path="/edit-recipe/:id" element={<RecipeFormPage />} /> {/* Rute untuk edit resep */}
                {/* Opsional: Not Found Page */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </Router>
    );
}

export default App;