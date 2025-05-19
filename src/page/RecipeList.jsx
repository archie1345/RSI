import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // or wherever your supabase client is initialized


function RecipeList({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [filter, setFilter] = useState('public'); // 'public' or 'private'
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
    await supabase.auth.signOut(); // removes session from client
    window.location.reload(); // or navigate to login screen
  };

  return (
    <div className="p-4">
       <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 space-x-2">
        <button
          onClick={() => setFilter('public')}
          className={`px-4 py-2 rounded ${filter === 'public' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Public
        </button>
        <button
          onClick={() => setFilter('private')}
          className={`px-4 py-2 rounded ${filter === 'private' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Private
        </button>
        <button
          onClick={() => navigate('/add')}
          className="px-4 py-2 bg-green-500 text-white rounded float-right"
        >
          + Add New Recipe
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="text-gray-500">No recipes to display.</p>
      ) : (
        <ul>
          {recipes.map((r) => (
            <li
              key={r.recipeid}
              className="cursor-pointer hover:bg-gray-100 p-2 border-b"
              onClick={() => navigate(`/recipe/${r.recipeid}`)}
            >
              {r.title}
              {r.visibility === 'private' && r.userid === user?.id && (
                <span className="text-sm text-gray-500 ml-2">(Private)</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecipeList;
