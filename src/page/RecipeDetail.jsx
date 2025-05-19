import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRecipeById, deleteRecipe } from '../api/recipeApi';

const RecipeDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await getRecipeById(id, user?.id);
      if (error || !data) {
        // Recipe not found or user unauthorized
        alert('Recipe not found or you do not have access.');
        navigate('/', { replace: true });
      } else {
        setRecipe(data);
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [id, user, navigate]);

  const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete this recipe?')) {
    const { error } = await deleteRecipe(recipe.recipeid);
    if (!error) {
      navigate('/');
    } else {
      console.error('Delete error:', error.message);
      alert('Failed to delete recipe. Please try again.');
    }
  }
};

  if (loading) return <div>Loading...</div>;
  if (!recipe) return null;


  const isOwner = user?.id === recipe.userid;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '700px', margin: 'auto', padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← Back</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{recipe.title}</h1>
        {isOwner && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ⋮
            </button>
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '2rem',
                  background: 'white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  borderRadius: '6px',
                  zIndex: 1,
                }}
              >
                <button
                  onClick={() => navigate(`/edit/${recipe.recipeid}`)}
                  style={{ padding: '0.5rem 1rem', width: '100%', border: 'none', background: 'white', cursor: 'pointer' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{ padding: '0.5rem 1rem', width: '100%', border: 'none', background: 'white', cursor: 'pointer', color: 'red' }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ color: 'gray', fontSize: '0.9rem' }}>
        By {recipe.username || 'Unknown'} • {new Date(recipe.createdat).toDateString()}
      </div>

      <p style={{ marginTop: '2rem' }}>{recipe.description}</p>

      {recipe.pictlink && (
        <img
          src={recipe.pictlink}
          alt="Recipe"
          style={{ width: '100%', borderRadius: '12px', margin: '1rem 0' }}
        />
      )}

      <h2>Ingredients</h2>
      <ul style={{ paddingLeft: '1.2rem' }}>
        {recipe.ingredients?.map((ing, idx) => (
          <li key={idx}>{ing.amount} {ing.unit} {ing.item}</li>
        ))}
      </ul>

      <h2>Steps</h2>
      <div>
        {recipe.steps?.map((step, idx) => (
          <div key={idx} style={{ marginBottom: '1rem' }}>
            <strong>Step {idx + 1}:</strong> {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeDetail;
