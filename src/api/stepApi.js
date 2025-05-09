import { supabase } from '../supabaseClient.js'

// CREATE session
export const createStep = async (Step) => {
  return await supabase.from('Step').insert([step])
}

// READ session(s)
export const getSteps = async () => {
  return await supabase.from('Step').select('*')
}

// UPDATE session
export const updateSteps = async (stepsId, updates) => {
  return await supabase.from('Steps').update(updates).eq('stepsId', stepsId)
}

// DELETE session
export const deleteSteps = async (recipeId) => {
  return await supabase.from('Steps').delete().eq('stepsId', stepsId)
}