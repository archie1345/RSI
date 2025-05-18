import { supabase } from '../supabaseClient.js'


export const createRecipe = async (data) => {
  const payload = {
    title: data.title,
    description: data.description,
    pictlink: data.pictLink || null,
    visibility: data.visibility,
    ingredients: data.ingredients,
    steps: data.steps,
  };

  console.log('Payload for insert:', payload);

  const { data: insertedData, error } = await supabase
    .from('Recipe')
    .insert([payload]);

  if (error) {
  console.error('Insert error:', error);
  alert(`Insert failed: ${error.message}`);
}

  return { data: insertedData, error };
};



export const getRecipes = async () => {
  return await supabase.from('Recipe').select('*')
}

export const updateRecipe = async (id, data) => {
  // Transform keys if needed to match DB columns
  const payload = {
    title: data.title,
    description: data.description,
    pictlink: data.pictlink, // rename to DB column
    visibility: data.visibility,
    ingredients: data.ingredients, // assuming JSONB column
    steps: data.steps // assuming JSONB column
  };

  const { error } = await supabase
    .from('Recipe')
    .update(payload)
    .eq('recipeid', id);

  return { error };
};


export const deleteRecipe = async (recipeid) => {
  return await supabase.from('Recipe').delete().eq('recipeid', recipeid)
}

