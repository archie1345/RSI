import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import React from 'react';
import './RecipeList.css';

function RecipeList({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [filter, setFilter] = useState('public');
  const navigate = useNavigate();

  useEffect(() => {
    getRecipes().then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        setAllRecipes(data);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const filtered =
      filter === 'public'
        ? allRecipes.filter(r => r.visibility === 'public' || r.userid === user.id)
        : allRecipes.filter(r => r.userid === user.id);

    setRecipes(filtered);
  }, [filter, allRecipes, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Recipes</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter('public')}
          className={filter === 'public' ? 'active-filter' : ''}
        >
          Public
        </button>
        <button
          onClick={() => setFilter('private')}
          className={filter === 'private' ? 'active-filter' : ''}
        >
          Private
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="no-recipes">No recipes to display.</p>
      ) : (
        <ul className="recipe-list">
          {recipes.map((r) => (
            <li
              key={r.recipeid}
              className="recipe-item"
              onClick={() => navigate(`/recipe/${r.recipeid}`)}
            >
              {r.title}
              {r.visibility === 'private' && r.userid === user?.id && (
                <span className="private-label">(Private)</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate('/add')}
        className="add-button"
      >
        + Add New Recipe
      </button>
    </div>
  );
}

export default RecipeList;
