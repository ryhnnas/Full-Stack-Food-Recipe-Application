// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Sesuaikan dengan port backend Anda

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getRecipes = async (search = '', category_id = '') => {
    try {
        const response = await api.get('/recipes', {
            params: {
                search,
                category_id
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

export const getRecipeById = async (id) => {
    try {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching recipe with ID ${id}:`, error);
        throw error;
    }
};

// Membuat Resep Baru
export const createRecipe = async (recipeData) => {
    try {
        const response = await api.post('/recipes', recipeData);
        return response.data;
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};

// Memperbarui Resep
export const updateRecipe = async (id, recipeData) => {
    try {
        const response = await api.put(`/recipes/${id}`, recipeData);
        return response.data;
    } catch (error) {
        console.error(`Error updating recipe with ID ${id}:`, error);
        throw error;
    }
};

// Menghapus Resep
export const deleteRecipe = async (id) => {
    try {
        const response = await api.delete(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting recipe with ID ${id}:`, error);
        throw error;
    }
};