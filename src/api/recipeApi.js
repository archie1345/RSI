import { supabase } from '../supabaseClient.js'


export const createRecipe = async (data, userId) => {
  const payload = {
    userid: userId,
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('Recipe')
    .select('*')
    .or(`visibility.eq.public,userid.eq.${user.id}`);

  return { data, error };
};



  export const getRecipeById = async (id, userId) => {
    const { data, error } = await supabase
      .from('Recipe')
      .select('*')
      .or(`visibility.eq.public,userid.eq.${userId}`)
      .eq('recipeid', id)
      .single();

    return { data, error };
  };




export const updateRecipe = async (id, data) => {
  const payload = {
    title: data.title,
    description: data.description,
    pictlink: data.pictlink,
    visibility: data.visibility,
    ingredients: data.ingredients,
    steps: data.steps
  };

  const { error } = await supabase
    .from('Recipe')
    .update(payload)
    .eq('recipeid', id);

  return { error };
};


export const deleteRecipe = async (recipeid) => {
  const { error } = await supabase
    .from('Recipe')
    .delete()
    .eq('recipeid', recipeid);

  return { error };
};
