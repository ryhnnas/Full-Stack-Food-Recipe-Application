// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css'; // Buat file CSS untuk RecipeCard

function RecipeCard({ recipe }) {
    return (
        <Link to={`/recipes/${recipe.id}`} className="recipe-card">
            <div className="recipe-card-image-wrapper">
                <img src={recipe.image_url || '/images/placeholder.jpg'} alt={recipe.title} className="recipe-card-image" />
                <span className="category-tag">{recipe.category_name}</span>
            </div>
            <div className="recipe-card-content">
                <h3 className="recipe-card-title">{recipe.title}</h3>
                <p className="recipe-card-description">{recipe.description.substring(0, 80)}...</p>
                {/* Anda bisa menambahkan info lain di sini, misal waktu persiapan */}
            </div>
        </Link>
    );
}

export default RecipeCard;