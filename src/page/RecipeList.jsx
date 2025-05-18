import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRecipes().then(({ data, error }) => {
      if (error) console.error(error);
      else setRecipes(data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>
      <button
        onClick={() => navigate('/add')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add New Recipe
      </button>
      <ul>
        {recipes.map((r) => (
          <li
            key={r.recipeid}
            className="cursor-pointer hover:bg-gray-100 p-2"
            onClick={() => navigate(`/recipe/${r.recipeid}`)}
          >
            {r.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;