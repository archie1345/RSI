import { supabase } from '../supabaseClient.js'


export const createRecipe = async (data) => {
  return await supabase.from('Recipe').insert([data])
}

export const getRecipes = async () => {
  return await supabase.from('Recipe').select('*')
}

export const updateRecipe = async (recipeId, updates) => {
  return await supabase.from('Recipe').update(updates).eq('recipeId', recipeId)
}

export const deleteRecipe = async (recipeId) => {
  return await supabase.from('Recipe').delete().eq('recipeId', recipeId)
}

