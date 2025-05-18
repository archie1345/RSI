import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRecipe, updateRecipe, getRecipes } from '../api/recipeApi';

const units = ['g', 'ml', 'tsp', 'tbsp', 'cup', 'pcs'];

const RecipeForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pictLink: '',
    visibility: 'private',
    ingredients: [{ amount: '', unit: 'g', item: '' }],
    steps: ['']
  });
  const navigate = useNavigate();

  useEffect(() => {
  if (id) {
    const fetchRecipe = async () => {
      const { data, error } = await getRecipes();
      if (!error) {
        const recipe = data.find(r => r.recipeid === parseInt(id));
        if (recipe) {
          setFormData({
            title: recipe.title || '',
            description: recipe.description || '',
            pictLink: recipe.pictlink || '',
            visibility: recipe.visibility || 'private',
            ingredients: recipe.ingredients && recipe.ingredients.length > 0 
              ? recipe.ingredients 
              : [{ amount: '', unit: 'g', item: '' }],
            steps: recipe.steps && recipe.steps.length > 0 
              ? recipe.steps 
              : [''],
          });
        }
      }
    };
    fetchRecipe();
  }
}, [id]);


  const handleIngredientChange = (index, key, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][key] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { amount: '', unit: 'g', item: '' }]
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateRecipe(parseInt(id), formData);
    } else {
      await createRecipe(formData);
    }
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Recipe Builder</h1>
      <form onSubmit={handleSubmit}>
        <div className="section">
          <h2>Title</h2>
          <input
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Title"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <h2>Description</h2>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            rows={3}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <h2>Recipe Image</h2>
          <input
            value={formData.pictLink}
            onChange={e => setFormData({ ...formData, pictLink: e.target.value })}
            placeholder="Enter Image URL"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>

        <div className="section">
          <h2>Ingredients</h2>
          {formData.ingredients.map((ing, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="number"
                placeholder="Amount"
                value={ing.amount}
                onChange={e => handleIngredientChange(idx, 'amount', e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}
              />
              <select
                value={ing.unit}
                onChange={e => handleIngredientChange(idx, 'unit', e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}>
                {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </select>
              <input
                type="text"
                placeholder="Ingredient"
                value={ing.item}
                onChange={e => handleIngredientChange(idx, 'item', e.target.value)}
                style={{ flex: 2, padding: '0.5rem' }}
              />
              <button type="button" onClick={() => removeIngredient(idx)} style={{ color: 'red', fontWeight: 'bold' }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'green', color: 'white' }}>+ Add Ingredient</button>
        </div>

        <div className="section">
          <h2>Steps</h2>
          {formData.steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <label>Step {idx + 1}</label>
              <textarea
                rows={2}
                placeholder="Describe this step..."
                value={step}
                onChange={e => handleStepChange(idx, e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}
              />
              <button type="button" onClick={() => removeStep(idx)} style={{ color: 'red', fontWeight: 'bold' }}>✕</button>
            </div>
          ))}
          <button type="button" onClick={addStep} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'green', color: 'white' }}>+ Add Step</button>
        </div>

        <div className="section">
          <h2>Visibility</h2>
          <label>
            <input
              type="radio"
              value="private"
              checked={formData.visibility === 'private'}
              onChange={() => setFormData({ ...formData, visibility: 'private' })}
            /> Private
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              value="public"
              checked={formData.visibility === 'public'}
              onChange={() => setFormData({ ...formData, visibility: 'public' })}
            /> Public
          </label>
        </div>

        <button type="submit" style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: 'blue', color: 'white' }}>💾 Save Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;
