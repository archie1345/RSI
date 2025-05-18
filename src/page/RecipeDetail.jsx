import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipeApi';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await getRecipes();
      if (error) {
        console.error('Fetch error:', error);
      } else {
        const found = data.find(r => r.recipeid === parseInt(id));
        setRecipe(found);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '700px', margin: 'auto', padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← Back</button>

      <h1>{recipe.title}</h1>
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

      <button
        onClick={() => navigate(`/edit/${recipe.recipeid}`)}
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ✏️ Edit
      </button>
    </div>
  );
};

export default RecipeDetail;
