import { supabase } from '../supabaseClient.js'

// CREATE session
export const createIngredient = async (Ingredient) => {
  return await supabase.from('Ingredient').insert([Ingredient])
}

// READ session(s)
export const getIngredients = async () => {
  return await supabase.from('Ingredient').select('*')
}

// UPDATE session
export const updateIngredients = async (ingredientid, updates) => {
  return await supabase.from('Ingredient').update(updates).eq('ingredientid', ingredientid)
}

// DELETE session
export const deleteIngredients = async (ingredientid) => {
  return await supabase.from('Ingredient').delete().eq('ingredientid', ingredientid)
}